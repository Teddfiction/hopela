import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/hopela/locale-switcher";
import { UserMenu } from "@/components/hopela/user-menu";
import { createClient } from "@/lib/db/server";
import { Link, redirect } from "@/lib/i18n/navigation";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("nav");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
          <Link
            href="/dashboard"
            className="cn-font-heading text-lg font-semibold tracking-tight"
          >
            {t("brand")}
          </Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <UserMenu email={user!.email ?? ""} />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
