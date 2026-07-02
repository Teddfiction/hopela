import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopyButton } from "@/components/hopela/copy-button";
import { DeleteListButton } from "@/components/hopela/delete-list-button";
import { GiftForm } from "@/components/hopela/gift-form";
import { GiftRow } from "@/components/hopela/gift-row";
import { ListForm } from "@/components/hopela/list-form";
import { createGift } from "@/lib/core/gifts/actions";
import { updateList } from "@/lib/core/lists/actions";
import { getOwnedList } from "@/lib/core/lists/queries";
import { Link } from "@/lib/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getOwnedList(id);

  return { title: result?.list.title };
}

export default async function ListEditorPage({ params }: PageProps) {
  const { locale, id } = await params;
  const result = await getOwnedList(id);

  if (!result) {
    notFound();
  }

  const { list, gifts } = result;
  const t = await getTranslations("listEditor");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const publicUrl = `${siteUrl}/${locale}/list/${list.public_slug}`;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Button
            asChild
            variant="link"
            className="h-auto self-start p-0 text-muted-foreground"
          >
            <Link href="/dashboard">← {t("back")}</Link>
          </Button>
          <h1 className="cn-font-heading text-2xl font-semibold">
            {list.emoji && <span aria-hidden>{list.emoji} </span>}
            {list.title}
          </h1>
        </div>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>{t("shareTitle")}</CardTitle>
          <CardDescription>{t("shareDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <code className="max-w-full truncate rounded-2xl bg-muted px-3 py-2 text-xs">
            {publicUrl}
          </code>
          <CopyButton value={publicUrl} />
          <Button asChild variant="ghost" size="sm">
            <Link href={`/list/${list.public_slug}`}>{t("viewPublic")}</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid items-start gap-8 lg:grid-cols-[5fr_4fr]">
        <div className="flex flex-col gap-4">
          <h2 className="cn-font-heading text-lg font-medium">
            {t("giftsTitle", { count: gifts.length })}
          </h2>

          <Card size="sm">
            <CardHeader>
              <CardTitle>{t("addGiftTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <GiftForm
                action={createGift.bind(null, list.id)}
                submitLabel={t("addGift")}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            {gifts.map((gift) => (
              <GiftRow key={gift.id} gift={gift} />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="cn-font-heading text-lg font-medium">
            {t("settingsTitle")}
          </h2>
          <Card size="sm">
            <CardContent>
              <ListForm
                action={updateList.bind(null, list.id)}
                list={list}
                submitLabel={t("saveChanges")}
              />
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle className="text-destructive">
                {t("dangerTitle")}
              </CardTitle>
              <CardDescription>{t("dangerDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <DeleteListButton listId={list.id} listTitle={list.title} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
