import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/hopela/locale-switcher";
import { createClient } from "@/lib/db/server";
import { Link } from "@/lib/i18n/navigation";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="cn-font-heading text-lg font-semibold tracking-tight"
        >
          {t("brand")}
        </Link>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          {user ? (
            <Link
              href="/dashboard"
              className={buttonVariants({ size: "sm" })}
            >
              {t("dashboard")}
            </Link>
          ) : (
            <Link href="/login" className={buttonVariants({ size: "sm" })}>
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
