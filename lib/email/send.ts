import "server-only";

import { getTranslations } from "next-intl/server";
import { Resend } from "resend";

import { ReservationConfirmedEmail } from "@/lib/email/reservation-confirmed";

export interface ReservationConfirmationInput {
  to: string;
  locale: string;
  reserverName: string;
  giftTitle: string;
  listTitle: string;
  listUrl: string;
  cancelUrl: string;
}

export async function sendReservationConfirmation(
  input: ReservationConfirmationInput
): Promise<void> {
  const t = await getTranslations({
    locale: input.locale,
    namespace: "emails.reservationConfirmed",
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Hopélà! <onboarding@resend.dev>",
    to: input.to,
    subject: t("subject", { giftTitle: input.giftTitle }),
    react: ReservationConfirmedEmail({
      strings: {
        preview: t("preview", { giftTitle: input.giftTitle }),
        heading: t("heading"),
        greeting: t("greeting", { name: input.reserverName }),
        body: t("body", {
          giftTitle: input.giftTitle,
          listTitle: input.listTitle,
        }),
        viewList: t("viewList"),
        cancelIntro: t("cancelIntro"),
        cancelLink: t("cancelLink"),
        footer: t("footer"),
      },
      listUrl: input.listUrl,
      cancelUrl: input.cancelUrl,
    }),
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
