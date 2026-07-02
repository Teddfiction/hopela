"use client";

import { useState } from "react";
import { Delete02Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFormatter, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/hopela/confirm-dialog";
import { GiftForm } from "@/components/hopela/gift-form";
import {
  deleteGift,
  updateGift,
  type GiftFormState,
} from "@/lib/core/gifts/actions";
import type { Gift } from "@/lib/db/types";

export function GiftRow({ gift }: { gift: Gift }) {
  const t = useTranslations("giftRow");
  const format = useFormatter();
  const [editOpen, setEditOpen] = useState(false);

  const boundUpdate = (prevState: GiftFormState, formData: FormData) =>
    updateGift(gift.id, gift.list_id, prevState, formData);

  return (
    <Card size="sm">
      <CardContent className="flex flex-wrap items-center gap-4">
        {gift.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gift.image_url}
            alt=""
            className="aspect-[3/4] w-12 shrink-0 rounded-2xl object-cover ring-1 ring-border"
          />
        ) : (
          <div className="flex aspect-[3/4] w-12 shrink-0 items-center justify-center rounded-2xl bg-muted text-xl">
            <span aria-hidden>🎁</span>
          </div>
        )}

        <div className="flex min-w-32 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium">{gift.title}</span>
            {gift.is_top_priority && <Badge>{t("topPriority")}</Badge>}
            {gift.status === "reserved" ? (
              <Badge variant="secondary">{t("reserved")}</Badge>
            ) : (
              <Badge variant="outline">{t("available")}</Badge>
            )}
          </div>
          {gift.price && (
            <span className="text-sm text-muted-foreground">
              {format.number(Number(gift.price), {
                style: "currency",
                currency: gift.currency ?? "EUR",
              })}
            </span>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon-sm">
                <HugeiconsIcon icon={Edit02Icon} />
                <span className="sr-only">{t("edit")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{t("editTitle")}</DialogTitle>
              </DialogHeader>
              <GiftForm
                action={boundUpdate}
                gift={gift}
                submitLabel={t("saveChanges")}
                onDone={() => setEditOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <ConfirmDialog
            trigger={
              <Button variant="destructive" size="icon-sm">
                <HugeiconsIcon icon={Delete02Icon} />
                <span className="sr-only">{t("delete")}</span>
              </Button>
            }
            title={t("deleteConfirmTitle")}
            description={t("deleteConfirmDescription", { title: gift.title })}
            confirmLabel={t("delete")}
            onConfirm={() => deleteGift(gift.id, gift.list_id)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
