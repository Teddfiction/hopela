import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/hopela/copy-button";
import { coverStyles } from "@/components/hopela/covers";
import { getMyLists } from "@/lib/core/lists/queries";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });

  return { title: t("title") };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("dashboard");
  const format = await getFormatter();
  const lists = await getMyLists();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="cn-font-heading text-2xl font-semibold">{t("title")}</h1>
        <Button asChild>
          <Link href="/dashboard/new">{t("newList")}</Link>
        </Button>
      </div>

      {lists.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("empty.title")}</CardTitle>
            <CardDescription>{t("empty.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/new">{t("empty.cta")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((list) => {
            const giftCount = list.gift[0]?.count ?? 0;

            return (
              <Card key={list.id} size="sm" className="pt-0">
                <div
                  className={cn(
                    "flex h-20 items-center justify-center rounded-t-4xl text-3xl",
                    list.cover_image
                      ? coverStyles[list.cover_image]
                      : "bg-muted"
                  )}
                >
                  <span aria-hidden>{list.emoji ?? "🎁"}</span>
                </div>
                <CardHeader>
                  <CardTitle className="truncate">{list.title}</CardTitle>
                  <CardDescription>
                    {t("giftsCount", { count: giftCount })}
                    {list.event_date &&
                      ` · ${format.dateTime(new Date(list.event_date), {
                        dateStyle: "medium",
                      })}`}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto flex-wrap gap-2">
                  <Button asChild size="sm">
                    <Link href={`/dashboard/lists/${list.id}`}>
                      {t("manage")}
                    </Link>
                  </Button>
                  <CopyButton
                    value={`${siteUrl}/${locale}/list/${list.public_slug}`}
                    label={t("copyLink")}
                  />
                  {!list.anti_spoil && (
                    <Badge variant="outline">{t("spoilOff")}</Badge>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
