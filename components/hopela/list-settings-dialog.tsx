"use client";

import { useState } from "react";
import { Settings01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DeleteListButton } from "@/components/hopela/delete-list-button";
import { dialogFullscreen } from "@/components/hopela/dialog-fullscreen";
import { ListForm } from "@/components/hopela/list-form";
import type { ListFormState } from "@/lib/core/lists/actions";
import type { List } from "@/lib/db/types";

interface ListSettingsDialogProps {
  action: (
    prevState: ListFormState,
    formData: FormData
  ) => Promise<ListFormState>;
  list: List;
}

export function ListSettingsDialog({ action, list }: ListSettingsDialogProps) {
  const t = useTranslations("listEditor");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="icon" />}>
        <HugeiconsIcon icon={Settings01Icon} />
        <span className="sr-only">{t("settingsTitle")}</span>
      </DialogTrigger>
      <DialogContent className={dialogFullscreen}>
        <DialogHeader>
          <DialogTitle>{t("settingsTitle")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <ListForm
            action={action}
            list={list}
            submitLabel={t("saveChanges")}
            onDone={() => setOpen(false)}
          />

          <Separator />

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-destructive">{t("dangerTitle")}</p>
              <p className="text-sm text-muted-foreground">
                {t("dangerDescription")}
              </p>
            </div>
            <div>
              <DeleteListButton listId={list.id} listTitle={list.title} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
