"use server";

import { z } from "zod";

export interface UnfurlResult {
  status: "ok" | "partial" | "error";
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  price: string | null;
  currency: string | null;
}

const EMPTY: Omit<UnfurlResult, "status"> = {
  title: null,
  description: null,
  imageUrl: null,
  price: null,
  currency: null,
};

const urlSchema = z.string().trim().url().startsWith("http");

const BLOCKED_HOSTS = /^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|0\.|\[::1\])/i;

function extractMeta(html: string, property: string): string | null {
  // Matches <meta property="og:title" content="..."> in either attribute order.
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
      "i"
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return decodeEntities(match[1].trim());
    }
  }

  return null;
}

/**
 * og:image is often a relative path (e.g. `/img/product.jpg`). Resolve it
 * against the final response URL so the form receives an absolute http(s) URL.
 */
function resolveImageUrl(raw: string, baseUrl: string): string | null {
  try {
    const resolved = new URL(raw, baseUrl);

    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
      return null;
    }

    return resolved.href;
  } catch {
    return null;
  }
}

function decodeEntities(value: string): string {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'");
}

/**
 * Open Graph unfurl for the URL-first gift flow (SPEC §2 — Gifts).
 * Best effort: a partial or failed unfurl falls back to manual entry.
 */
export async function unfurlUrl(rawUrl: string): Promise<UnfurlResult> {
  const parsed = urlSchema.safeParse(rawUrl);

  if (!parsed.success) {
    return { status: "error", ...EMPTY };
  }

  const url = new URL(parsed.data);

  if (BLOCKED_HOSTS.test(url.hostname)) {
    return { status: "error", ...EMPTY };
  }

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(6000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HopelaBot/1.0; +https://hopela.app)",
        Accept: "text/html",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return { status: "error", ...EMPTY };
    }

    // 1 MB is plenty for <head> metadata.
    const html = (await response.text()).slice(0, 1_000_000);

    const title =
      extractMeta(html, "og:title") ??
      html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ??
      null;
    const description =
      extractMeta(html, "og:description") ??
      extractMeta(html, "description");
    const rawImage = extractMeta(html, "og:image");
    const imageUrl = rawImage
      ? resolveImageUrl(rawImage, response.url || url.href)
      : null;
    const rawPrice =
      extractMeta(html, "product:price:amount") ??
      extractMeta(html, "og:price:amount");
    const currency =
      extractMeta(html, "product:price:currency") ??
      extractMeta(html, "og:price:currency");

    const price =
      rawPrice && /^\d{1,8}([.,]\d{1,2})?$/.test(rawPrice)
        ? rawPrice.replace(",", ".")
        : null;

    const complete = Boolean(title && description && imageUrl);

    return {
      status: title || description || imageUrl ? (complete ? "ok" : "partial") : "error",
      title: title ? decodeEntities(title) : null,
      description,
      imageUrl,
      price,
      currency: currency?.length === 3 ? currency.toUpperCase() : null,
    };
  } catch {
    return { status: "error", ...EMPTY };
  }
}
