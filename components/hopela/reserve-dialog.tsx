"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/hopela/submit-button";
import {
  reserveGift,
  type ReserveFormState,
} from "@/lib/core/reservations/actions";

const initialState: ReserveFormState = { status: "idle" };

export function ReserveDialog({
  giftId,
  giftTitle,
}: {
  giftId: string;
  giftTitle: string;
}) {
  const t = useTranslations("reserve");
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(reserveGift, initialState);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>{t("cta")}</DialogTrigger>
      <DialogContent>
        {state.status === "reserved" ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("success.title")}</DialogTitle>
              <DialogDescription>{t("success.description")}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" onClick={() => setOpen(false)}>
                {t("close")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("title", { gift: giftTitle })}</DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
            </DialogHeader>
            <form action={formAction} className="flex flex-col gap-4">
              <input type="hidden" name="giftId" value={giftId} />
              <div className="flex flex-col gap-2">
                <Label htmlFor={`reserve-${giftId}-name`}>
                  {t("nameLabel")}
                </Label>
                <Input
                  id={`reserve-${giftId}-name`}
                  name="name"
                  autoComplete="name"
                  maxLength={120}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor={`reserve-${giftId}-email`}>
                  {t("emailLabel")}
                </Label>
                <Input
                  id={`reserve-${giftId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {t("emailHint")}
                </p>
              </div>

              {state.status === "already_reserved" && (
                <Alert variant="destructive">
                  <AlertTitle>{t("alreadyReserved.title")}</AlertTitle>
                  <AlertDescription>
                    {t("alreadyReserved.description")}
                  </AlertDescription>
                </Alert>
              )}
              {state.status === "error" && (
                <Alert variant="destructive">
                  <AlertDescription>{t("error")}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <SubmitButton>{t("submit")}</SubmitButton>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
