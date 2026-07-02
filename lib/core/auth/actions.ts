"use server";

import { getLocale } from "next-intl/server";
import { z } from "zod";

import { createClient } from "@/lib/db/server";
import { redirect } from "@/lib/i18n/navigation";

const signInSchema = z.object({
  email: z.string().trim().email(),
});

export interface AuthFormState {
  status: "idle" | "sent" | "error";
}

export async function signInWithMagicLink(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { status: "error" };
  }

  const locale = await getLocale();
  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${siteUrl}/api/auth/callback?locale=${locale}`,
    },
  });

  if (error) {
    return { status: "error" };
  }

  return { status: "sent" };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const locale = await getLocale();
  redirect({ href: "/", locale });
}
