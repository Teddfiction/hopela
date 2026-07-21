"use client";

import { Share01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CopyButton } from "@/components/hopela/copy-button";

export function ShareListPopover({ publicUrl }: { publicUrl: string }) {
  const t = useTranslations("listEditor");

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        <HugeiconsIcon icon={Share01Icon} data-icon="inline-start" />
        {t("share")}
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <PopoverHeader>
          <PopoverTitle>{t("shareTitle")}</PopoverTitle>
          <PopoverDescription>{t("shareDescription")}</PopoverDescription>
        </PopoverHeader>
        <code className="rounded-2xl bg-muted px-3 py-2 text-xs break-all">
          {publicUrl}
        </code>
        <div>
          <CopyButton value={publicUrl} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
