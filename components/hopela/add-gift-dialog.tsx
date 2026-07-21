"use client";

import { useState } from "react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
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
import { dialogFullscreen } from "@/components/hopela/dialog-fullscreen";
import { GiftForm } from "@/components/hopela/gift-form";
import type { GiftFormState } from "@/lib/core/gifts/actions";

interface AddGiftDialogProps {
  action: (
    prevState: GiftFormState,
    formData: FormData
  ) => Promise<GiftFormState>;
}

export function AddGiftDialog({ action }: AddGiftDialogProps) {
  const t = useTranslations("listEditor");
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <HugeiconsIcon icon={PlusSignIcon} data-icon="inline-start" />
        {t("addGiftTitle")}
      </DialogTrigger>
      <DialogContent className={dialogFullscreen}>
        <DialogHeader>
          <DialogTitle>{t("addGiftTitle")}</DialogTitle>
        </DialogHeader>
        <GiftForm
          action={action}
          submitLabel={t("addGift")}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
