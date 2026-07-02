"use client";

import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { coverEmojis, coverStyles } from "@/components/hopela/covers";
import { SubmitButton } from "@/components/hopela/submit-button";
import type { ListFormState } from "@/lib/core/lists/actions";
import { coverImages } from "@/lib/core/lists/schema";
import { cn } from "@/lib/utils";
import type { CoverImage, List } from "@/lib/db/types";

const initialState: ListFormState = { status: "idle" };

interface ListFormProps {
  action: (
    prevState: ListFormState,
    formData: FormData
  ) => Promise<ListFormState>;
  list?: List;
  submitLabel: string;
  onDone?: () => void;
}

export function ListForm({ action, list, submitLabel, onDone }: ListFormProps) {
  const t = useTranslations("listForm");
  const [state, formAction] = useActionState(action, initialState);
  const [cover, setCover] = useState<CoverImage | "">(
    list?.cover_image ?? ""
  );

  useEffect(() => {
    if (state.status === "error") {
      toast.error(t("error"));
    }
    if (state.status === "updated") {
      toast.success(t("updated"));
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">{t("titleLabel")}</Label>
          <Input
            id="title"
            name="title"
            defaultValue={list?.title}
            placeholder={t("titlePlaceholder")}
            maxLength={120}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="emoji">{t("emojiLabel")}</Label>
          <Input
            id="emoji"
            name="emoji"
            defaultValue={list?.emoji ?? ""}
            placeholder="🎁"
            maxLength={8}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">{t("descriptionLabel")}</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={list?.description ?? ""}
          maxLength={2000}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="event_date">{t("eventDateLabel")}</Label>
        <Input
          id="event_date"
          name="event_date"
          type="date"
          defaultValue={list?.event_date ?? ""}
          className="sm:max-w-48"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>{t("coverLabel")}</Label>
        <input type="hidden" name="cover_image" value={cover} />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={cover === "" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setCover("")}
          >
            {t("coverNone")}
          </Button>
          {coverImages.map((key) => (
            <Button
              key={key}
              type="button"
              variant="ghost"
              size="icon"
              aria-pressed={cover === key}
              onClick={() => setCover(key)}
              className={cn(
                coverStyles[key],
                cover === key && "ring-2 ring-ring"
              )}
            >
              <span aria-hidden>{coverEmojis[key]}</span>
              <span className="sr-only">{key}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-2xl bg-muted p-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="anti_spoil">{t("antiSpoilLabel")}</Label>
          <p className="text-xs text-muted-foreground">{t("antiSpoilHint")}</p>
        </div>
        <Switch
          id="anti_spoil"
          name="anti_spoil"
          defaultChecked={list?.anti_spoil ?? true}
        />
      </div>

      <div>
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
