import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/db/admin";
import { routing } from "@/lib/i18n/routing";

const cancelSchema = z.object({
  token: z.string().uuid(),
  locale: z.enum(routing.locales).catch(routing.defaultLocale),
});

/**
 * Self-cancel — inbound external surface (the confirm form on
 * /[locale]/cancel/[token] posts here). Deleting the reservation fires
 * the DB trigger that flips the gift back to `available`.
 */
export async function POST(request: Request) {
  const formData = await request.formData();

  const parsed = cancelSchema.safeParse({
    token: formData.get("token"),
    locale: formData.get("locale"),
  });

  const { origin } = new URL(request.url);

  if (!parsed.success) {
    return NextResponse.redirect(`${origin}/`, 303);
  }

  const { token, locale } = parsed.data;
  const admin = createAdminClient();

  const { data } = await admin
    .from("reservation")
    .delete()
    .eq("cancel_token", token)
    .select("id");

  const outcome = data && data.length > 0 ? "done" : "invalid";

  return NextResponse.redirect(
    `${origin}/${locale}/cancel/result?outcome=${outcome}`,
    303
  );
}
