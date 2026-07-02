import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReservationByToken } from "@/lib/core/reservations/queries";
import { Link } from "@/lib/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string; token: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cancelPage" });

  return { title: t("title"), robots: { index: false } };
}

/**
 * Cancel-link landing page (GET — renders only, no mutation).
 * The confirm form posts to /api/cancel, the inbound external surface
 * that actually deletes the reservation.
 */
export default async function CancelPage({ params }: PageProps) {
  const { locale, token } = await params;
  const t = await getTranslations("cancelPage");

  const tokenParsed = z.string().uuid().safeParse(token);
  const reservation = tokenParsed.success
    ? await getReservationByToken(tokenParsed.data)
    : null;

  return (
    <div className="mx-auto w-full max-w-md px-4 py-20">
      {reservation ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t("title")}</CardTitle>
            <CardDescription>
              {t("description", {
                gift: reservation.giftTitle,
                list: reservation.listTitle,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/cancel" method="POST">
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="locale" value={locale} />
              <Button type="submit" variant="destructive">
                {t("confirm")}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t("invalid.title")}</CardTitle>
            <CardDescription>{t("invalid.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link href="/">{t("backHome")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
