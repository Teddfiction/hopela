import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { coverStyles } from "@/components/hopela/covers";
import { GiftCard } from "@/components/hopela/gift-card";
import { getPublicList } from "@/lib/core/lists/queries";
import { getReserverNames } from "@/lib/core/reservations/queries";
import { createClient } from "@/lib/db/server";
import type { PublicGift } from "@/lib/db/types";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const result = await getPublicList(slug);

  if (!result) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "publicList" });

  return {
    title: result.list.title,
    description: result.list.description ?? t("metaDescription"),
  };
}

/**
 * Public list view — no login required. Anti-spoil is applied HERE,
 * server-side, before anything is serialized to the client:
 *  - anti_spoil ON  → reserved gifts are hidden from contributors
 *    (the owner still sees them, without the reserver's name);
 *  - anti_spoil OFF → reserved gifts show "Reserved by {name}".
 * reserver_email is never selected into any payload.
 */
export default async function PublicListPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPublicList(slug);

  if (!result) {
    notFound();
  }

  const { list, gifts } = result;
  const t = await getTranslations("publicList");
  const format = await getFormatter();

  // Is the viewer the list owner?
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = user?.id === list.owner_id;

  let visibleGifts: PublicGift[];

  if (list.anti_spoil) {
    const base = isOwner ? gifts : gifts.filter((g) => g.status === "available");
    visibleGifts = base.map((gift) => ({ ...gift, reserverName: null }));
  } else {
    const reservedIds = gifts
      .filter((g) => g.status === "reserved")
      .map((g) => g.id);
    const names = await getReserverNames(reservedIds);
    visibleGifts = gifts.map((gift) => ({
      ...gift,
      reserverName: names.get(gift.id) ?? null,
    }));
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <Card className="pt-0">
        <div
          className={cn(
            "flex h-32 items-center justify-center rounded-t-4xl text-5xl",
            list.cover_image ? coverStyles[list.cover_image] : "bg-muted"
          )}
        >
          <span aria-hidden>{list.emoji ?? "🎁"}</span>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">{list.title}</CardTitle>
          {list.event_date && (
            <Badge variant="secondary" className="w-fit">
              {format.dateTime(new Date(list.event_date), {
                dateStyle: "long",
              })}
            </Badge>
          )}
          {list.description && (
            <CardDescription className="max-w-2xl whitespace-pre-line text-base">
              {list.description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {visibleGifts.length === 0 ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle>{t("empty.title")}</CardTitle>
            <CardDescription>{t("empty.description")}</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleGifts.map((gift) => (
            <GiftCard key={gift.id} gift={gift} />
          ))}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">
        {t("antiSpoilNote")}
      </p>
    </div>
  );
}
