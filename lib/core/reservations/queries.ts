import "server-only";

import { createAdminClient } from "@/lib/db/admin";

/**
 * Client-safe projection for the cancel confirmation page.
 * Deliberately excludes reserver_email (never serialized) and
 * reserver_name (not needed to confirm a cancellation).
 */
export interface CancellableReservation {
  giftTitle: string;
  listTitle: string;
}

export async function getReservationByToken(
  token: string
): Promise<CancellableReservation | null> {
  const admin = createAdminClient();

  const { data } = await admin
    .from("reservation")
    .select("gift:gift_id (title, list:list_id (title))")
    .eq("cancel_token", token)
    .single<{ gift: { title: string; list: { title: string } } }>();

  if (!data) {
    return null;
  }

  return {
    giftTitle: data.gift.title,
    listTitle: data.gift.list.title,
  };
}

/**
 * Server-only map of reserved gift → reserver first name.
 * Only called when the list has anti_spoil = false; reserver_email
 * is never selected into this payload (docs/DATA_MODEL.md §4).
 */
export async function getReserverNames(
  giftIds: string[]
): Promise<Map<string, string>> {
  if (giftIds.length === 0) {
    return new Map();
  }

  const admin = createAdminClient();

  const { data } = await admin
    .from("reservation")
    .select("gift_id, reserver_name")
    .in("gift_id", giftIds);

  return new Map(
    (data ?? []).map((row) => [row.gift_id as string, row.reserver_name as string])
  );
}
