import { NextResponse } from "next/server";
import type { EmailOtpType, User } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/db/admin";
import { createClient } from "@/lib/db/server";
import { routing } from "@/lib/i18n/routing";

/**
 * Magic-link landing point (external actor: a click in an email is a GET).
 * Exchanges the Supabase code/token for a session, provisions the public
 * profile row on first sign-in, then redirects to the dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const requestedLocale = searchParams.get("locale");
  const locale = routing.locales.find((l) => l === requestedLocale)
    ? requestedLocale
    : routing.defaultLocale;

  const supabase = await createClient();
  let user: User | null = null;

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      user = data.user;
    }
  } else if (tokenHash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      user = data.user;
    }
  }

  if (!user?.email) {
    return NextResponse.redirect(`${origin}/${locale}/login?error=auth`);
  }

  // First sign-in: create the public profile mirror (service role —
  // the `user` table has no client insert policy by design).
  const admin = createAdminClient();
  await admin
    .from("user")
    .upsert(
      { id: user.id, email: user.email, locale },
      { onConflict: "id", ignoreDuplicates: true }
    );

  return NextResponse.redirect(`${origin}/${locale}/dashboard`);
}
