"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { z } from "zod";

import { giftSchema } from "@/lib/core/gifts/schema";
import { createClient } from "@/lib/db/server";

export interface GiftFormState {
  status: "idle" | "created" | "updated" | "error";
}

async function revalidateListPage(listId: string) {
  const locale = await getLocale();
  revalidatePath(`/${locale}/dashboard/lists/${listId}`);
}

export async function createGift(
  listId: string,
  _prevState: GiftFormState,
  formData: FormData
): Promise<GiftFormState> {
  const idParsed = z.string().uuid().safeParse(listId);
  const parsed = giftSchema.safeParse(Object.fromEntries(formData));

  if (!idParsed.success || !parsed.success) {
    return { status: "error" };
  }

  const supabase = await createClient();

  // RLS (gift_owner_insert) rejects inserts into lists the caller doesn't own.
  const { error } = await supabase.from("gift").insert({
    list_id: idParsed.data,
    ...parsed.data,
  });

  if (error) {
    return { status: "error" };
  }

  await revalidateListPage(idParsed.data);
  return { status: "created" };
}

export async function updateGift(
  giftId: string,
  listId: string,
  _prevState: GiftFormState,
  formData: FormData
): Promise<GiftFormState> {
  const idsParsed = z
    .object({ giftId: z.string().uuid(), listId: z.string().uuid() })
    .safeParse({ giftId, listId });
  const parsed = giftSchema.safeParse(Object.fromEntries(formData));

  if (!idsParsed.success || !parsed.success) {
    return { status: "error" };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("gift")
    .update(parsed.data)
    .eq("id", idsParsed.data.giftId);

  if (error) {
    return { status: "error" };
  }

  await revalidateListPage(idsParsed.data.listId);
  return { status: "updated" };
}

export async function deleteGift(
  giftId: string,
  listId: string
): Promise<void> {
  const parsed = z
    .object({ giftId: z.string().uuid(), listId: z.string().uuid() })
    .safeParse({ giftId, listId });

  if (!parsed.success) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("gift").delete().eq("id", parsed.data.giftId);

  await revalidateListPage(parsed.data.listId);
}
