import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EyeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { AddGiftDialog } from "@/components/hopela/add-gift-dialog";
import { GiftRow } from "@/components/hopela/gift-row";
import { ListSettingsDialog } from "@/components/hopela/list-settings-dialog";
import { ShareListPopover } from "@/components/hopela/share-list-popover";
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
    <div className="flex w-full min-w-0 flex-col gap-8">
      <h1 className="cn-font-heading min-w-0 text-2xl font-semibold break-words">
        {list.emoji && <span aria-hidden>{list.emoji} </span>}
        {list.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <AddGiftDialog action={createGift.bind(null, list.id)} />
        <ShareListPopover publicUrl={publicUrl} />
        <Link
          href={`/list/${list.public_slug}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <HugeiconsIcon icon={EyeIcon} data-icon="inline-start" />
          {t("viewPublic")}
        </Link>
        <ListSettingsDialog
          action={updateList.bind(null, list.id)}
          list={list}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="cn-font-heading text-lg font-medium">
          {t("giftsTitle", { count: gifts.length })}
        </h2>

        {gifts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("giftsEmpty")}</p>
        ) : (
          <div className="flex flex-col gap-3">
            {gifts.map((gift) => (
              <GiftRow key={gift.id} gift={gift} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
