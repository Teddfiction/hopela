import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListForm } from "@/components/hopela/list-form";
import { createList } from "@/lib/core/lists/actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "listForm" });

  return { title: t("createTitle") };
}

export default async function NewListPage() {
  const t = await getTranslations("listForm");

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t("createTitle")}</CardTitle>
          <CardDescription>{t("createDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ListForm action={createList} submitLabel={t("submitCreate")} />
        </CardContent>
      </Card>
    </div>
  );
}
