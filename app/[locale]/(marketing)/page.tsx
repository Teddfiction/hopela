import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/lib/i18n/navigation";

export default async function HomePage() {
  const t = await getTranslations("home");

  const steps = ["create", "share", "reserve"] as const;

  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <section className="flex flex-col items-center gap-6 py-20 text-center">
        <Badge variant="secondary">{t("hero.badge")}</Badge>
        <h1 className="cn-font-heading max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          {t("hero.title")}
        </h1>
        <p className="max-w-xl text-lg text-balance text-muted-foreground">
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/login" className={buttonVariants({ size: "lg" })}>
            {t("hero.cta")}
          </Link>
          <Link
            href="#how-it-works"
            className={buttonVariants({ size: "lg", variant: "outline" })}
          >
            {t("hero.secondaryCta")}
          </Link>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 pb-20">
        <h2 className="cn-font-heading mb-8 text-center text-2xl font-semibold">
          {t("how.title")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Card key={step} size="sm">
              <CardHeader>
                <Badge className="mb-2">{index + 1}</Badge>
                <CardTitle>{t(`how.${step}.title`)}</CardTitle>
                <CardDescription>{t(`how.${step}.description`)}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t("antiSpoil.title")}</CardTitle>
            <CardDescription className="max-w-2xl text-base">
              {t("antiSpoil.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login" className={buttonVariants()}>
              {t("antiSpoil.cta")}
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
