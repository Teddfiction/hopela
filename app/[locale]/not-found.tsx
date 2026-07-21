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

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <div className="mx-auto w-full max-w-md px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
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
