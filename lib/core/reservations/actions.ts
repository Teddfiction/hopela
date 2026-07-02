"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { z } from "zod";

import { sendReservationConfirmation } from "@/lib/email/send";
import { createAdminClient } from "@/lib/db/admin";

const reserveSchema = z.object({
  giftId: z.string().uuid(),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
});

export interface ReserveFormState {
  status: "idle" | "reserved" | "already_reserved" | "error";
}

const UNIQUE_VIOLATION = "23505";

/**
 * Anonymous reservation (SPEC §2). Runs with the service role because the
 * `reservation` table is fully locked to client keys. The returned state
 * never contains reservation data — anti-spoil by design.
 */
export async function reserveGift(
  _prevState: ReserveFormState,
  formData: FormData
): Promise<ReserveFormState> {
  const parsed = reserveSchema.safeParse({
    giftId: formData.get("giftId"),
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { status: "error" };
  }

  const admin = createAdminClient();

  const { data: gift } = await admin
    .from("gift")
    .select("id, title, status, list:list_id (title, public_slug)")
    .eq("id", parsed.data.giftId)
    .single<{
      id: string;
      title: string;
      status: string;
      list: { title: string; public_slug: string };
    }>();

  if (!gift) {
    return { status: "error" };
  }

  if (gift.status === "reserved") {
    return { status: "already_reserved" };
  }

  // unique (gift_id) settles concurrent reservations: second insert fails.
  const { data: reservation, error } = await admin
    .from("reservation")
    .insert({
      gift_id: parsed.data.giftId,
      reserver_name: parsed.data.name,
      reserver_email: parsed.data.email,
    })
    .select("cancel_token")
    .single();

  if (error) {
    return error.code === UNIQUE_VIOLATION
      ? { status: "already_reserved" }
      : { status: "error" };
  }

  const locale = await getLocale();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // Email failure must not undo the reservation — log and move on.
  try {
    await sendReservationConfirmation({
      to: parsed.data.email,
      locale,
      reserverName: parsed.data.name,
      giftTitle: gift.title,
      listTitle: gift.list.title,
      listUrl: `${siteUrl}/${locale}/list/${gift.list.public_slug}`,
      cancelUrl: `${siteUrl}/${locale}/cancel/${reservation.cancel_token}`,
    });
  } catch (emailError) {
    console.error("[reservation] confirmation email failed", emailError);
  }

  revalidatePath(`/${locale}/list/${gift.list.public_slug}`);
  return { status: "reserved" };
}
