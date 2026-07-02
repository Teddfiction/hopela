import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("common");

  return (
    <footer className="border-t">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-center px-4">
        <p className="text-xs text-muted-foreground">
          {t("footer", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
