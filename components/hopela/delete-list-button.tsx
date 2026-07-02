"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/hopela/confirm-dialog";
import { deleteList } from "@/lib/core/lists/actions";

export function DeleteListButton({
  listId,
  listTitle,
}: {
  listId: string;
  listTitle: string;
}) {
  const t = useTranslations("listEditor");

  return (
    <ConfirmDialog
      trigger={<Button variant="destructive">{t("deleteList")}</Button>}
      title={t("deleteConfirmTitle")}
      description={t("deleteConfirmDescription", { title: listTitle })}
      confirmLabel={t("deleteList")}
      onConfirm={() => deleteList(listId)}
    />
  );
}
