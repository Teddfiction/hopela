"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/hopela/submit-button";
import {
  signInWithMagicLink,
  type AuthFormState,
} from "@/lib/core/auth/actions";

const initialState: AuthFormState = { status: "idle" };

export function LoginForm() {
  const t = useTranslations("login");
  const [state, formAction] = useActionState(signInWithMagicLink, initialState);

  if (state.status === "sent") {
    return (
      <Alert>
        <AlertTitle>{t("sent.title")}</AlertTitle>
        <AlertDescription>{t("sent.description")}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t("emailPlaceholder")}
              required
            />
          </div>
          {state.status === "error" && (
            <Alert variant="destructive">
              <AlertDescription>{t("error")}</AlertDescription>
            </Alert>
          )}
          <SubmitButton>{t("submit")}</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
