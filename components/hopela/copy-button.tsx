"use client";

import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function CopyButton({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const t = useTranslations("common");

  async function onCopy() {
    await navigator.clipboard.writeText(value);
    toast.success(t("copied"));
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={onCopy}>
      <HugeiconsIcon icon={Copy01Icon} data-icon="inline-start" />
      {label ?? t("copy")}
    </Button>
  );
}
