import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/lib/i18n/navigation";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ outcome?: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cancelPage" });

  return { title: t("title"), robots: { index: false } };
}

export default async function CancelResultPage({ searchParams }: PageProps) {
  const { outcome } = await searchParams;
  const t = await getTranslations("cancelPage");

  const done = outcome === "done";

  return (
    <div className="mx-auto w-full max-w-md px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {done ? t("done.title") : t("invalid.title")}
          </CardTitle>
          <CardDescription>
            {done ? t("done.description") : t("invalid.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            {t("backHome")}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
