"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { MagicWand01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/hopela/submit-button";
import type { GiftFormState } from "@/lib/core/gifts/actions";
import { unfurlUrl } from "@/lib/core/gifts/unfurl";
import type { Gift } from "@/lib/db/types";

const initialState: GiftFormState = { status: "idle" };

interface GiftFormProps {
  action: (
    prevState: GiftFormState,
    formData: FormData
  ) => Promise<GiftFormState>;
  gift?: Gift;
  submitLabel: string;
  onDone?: () => void;
}

export function GiftForm({ action, gift, submitLabel, onDone }: GiftFormProps) {
  const t = useTranslations("giftForm");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(action, initialState);
  const [unfurling, startUnfurl] = useTransition();

  const [url, setUrl] = useState(gift?.url ?? "");
  const [title, setTitle] = useState(gift?.title ?? "");
  const [description, setDescription] = useState(gift?.description ?? "");
  const [price, setPrice] = useState(gift?.price ?? "");
  const [currency, setCurrency] = useState(gift?.currency ?? "EUR");
  const [imageUrl, setImageUrl] = useState(gift?.image_url ?? "");

  useEffect(() => {
    if (state.status === "error") {
      toast.error(t("error"));
    }
    if (state.status === "created") {
      toast.success(t("added"));
      formRef.current?.reset();
      setUrl("");
      setTitle("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      onDone?.();
    }
    if (state.status === "updated") {
      toast.success(t("updated"));
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  function handleUnfurl() {
    startUnfurl(async () => {
      const result = await unfurlUrl(url);

      if (result.status === "error") {
        toast.warning(t("prefillError"));
        return;
      }

      if (result.title) setTitle(result.title);
      if (result.description) setDescription(result.description);
      if (result.imageUrl) setImageUrl(result.imageUrl);
      if (result.price) setPrice(result.price);
      if (result.currency) setCurrency(result.currency);

      toast[result.status === "ok" ? "success" : "info"](
        result.status === "ok" ? t("prefillSuccess") : t("prefillPartial")
      );
    });
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor={fieldId(gift, "url")}>{t("urlLabel")}</Label>
        <div className="flex gap-2">
          <Input
            id={fieldId(gift, "url")}
            name="url"
            type="url"
            inputMode="url"
            placeholder={t("urlPlaceholder")}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleUnfurl}
            disabled={!url || unfurling}
          >
            <HugeiconsIcon
              icon={MagicWand01Icon}
              data-icon="inline-start"
              className={unfurling ? "animate-pulse" : undefined}
            />
            {t("prefill")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={fieldId(gift, "title")}>{t("titleLabel")}</Label>
        <Input
          id={fieldId(gift, "title")}
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={fieldId(gift, "description")}>
          {t("descriptionLabel")}
        </Label>
        <Textarea
          id={fieldId(gift, "description")}
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
        <div className="flex flex-col gap-2">
          <Label htmlFor={fieldId(gift, "price")}>{t("priceLabel")}</Label>
          <Input
            id={fieldId(gift, "price")}
            name="price"
            inputMode="decimal"
            placeholder="29.90"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={fieldId(gift, "currency")}>{t("currencyLabel")}</Label>
          <Input
            id={fieldId(gift, "currency")}
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value.toUpperCase())}
            maxLength={3}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={fieldId(gift, "image_url")}>{t("imageLabel")}</Label>
        <Input
          id={fieldId(gift, "image_url")}
          name="image_url"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            className="mt-1 h-24 w-24 rounded-2xl object-cover ring-1 ring-border"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted p-4">
        <Label htmlFor={fieldId(gift, "is_top_priority")}>
          {t("topPriorityLabel")}
        </Label>
        <Switch
          id={fieldId(gift, "is_top_priority")}
          name="is_top_priority"
          defaultChecked={gift?.is_top_priority ?? false}
        />
      </div>

      <div>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}

function fieldId(gift: Gift | undefined, field: string): string {
  return gift ? `gift-${gift.id}-${field}` : `gift-new-${field}`;
}
