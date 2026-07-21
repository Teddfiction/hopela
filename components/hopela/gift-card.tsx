import { getFormatter, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReserveDialog } from "@/components/hopela/reserve-dialog";
import type { PublicGift } from "@/lib/db/types";

/**
 * Public gift card. Receives an already-filtered PublicGift: anti-spoil
 * decisions happened server-side, before this payload was serialized.
 */
export async function GiftCard({ gift }: { gift: PublicGift }) {
  const t = await getTranslations("publicList");
  const format = await getFormatter();

  const reserved = gift.status === "reserved";

  return (
    <Card size="sm" className={reserved ? "opacity-70" : undefined}>
      {gift.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={gift.image_url}
          alt=""
          className="-mt-(--card-spacing) aspect-[3/4] w-full object-cover"
        />
      )}
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          {gift.is_top_priority && <Badge>{t("topPriority")}</Badge>}
          {reserved && <Badge variant="secondary">{t("reserved")}</Badge>}
        </div>
        <CardTitle>{gift.title}</CardTitle>
        {gift.price && (
          <span className="text-sm text-muted-foreground">
            {format.number(Number(gift.price), {
              style: "currency",
              currency: gift.currency ?? "EUR",
            })}
          </span>
        )}
      </CardHeader>
      {gift.description && (
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {gift.description}
          </p>
        </CardContent>
      )}
      <CardFooter className="mt-auto flex-wrap gap-2">
        {reserved ? (
          gift.reserverName && (
            <span className="text-sm text-muted-foreground">
              {t("reservedBy", { name: gift.reserverName })}
            </span>
          )
        ) : (
          <ReserveDialog giftId={gift.id} giftTitle={gift.title} />
        )}
        {gift.url && (
          <a
            href={gift.url}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            {t("openLink")} ↗
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
