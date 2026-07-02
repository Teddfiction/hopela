"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { z } from "zod";

import { listSchema } from "@/lib/core/lists/schema";
import { generateSlug } from "@/lib/core/lists/slug";
import { createClient } from "@/lib/db/server";
import { redirect } from "@/lib/i18n/navigation";

export interface ListFormState {
  status: "idle" | "updated" | "error";
}

const UNIQUE_VIOLATION = "23505";

export async function createList(
  _prevState: ListFormState,
  formData: FormData
): Promise<ListFormState> {
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect({ href: "/login", locale });
  }

  const parsed = listSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { status: "error" };
  }

  // Slug collisions are astronomically unlikely but cheap to retry.
  let listId: string | null = null;

  for (let attempt = 0; attempt < 3 && !listId; attempt++) {
    const { data, error } = await supabase
      .from("list")
      .insert({
        owner_id: user!.id,
        ...parsed.data,
        public_slug: generateSlug(parsed.data.title),
      })
      .select("id")
      .single();

    if (data) {
      listId = data.id;
    } else if (error && error.code !== UNIQUE_VIOLATION) {
      return { status: "error" };
    }
  }

  if (!listId) {
    return { status: "error" };
  }

  redirect({ href: `/dashboard/lists/${listId}`, locale });
  return { status: "idle" };
}

export async function updateList(
  listId: string,
  _prevState: ListFormState,
  formData: FormData
): Promise<ListFormState> {
  const idParsed = z.string().uuid().safeParse(listId);
  const parsed = listSchema.safeParse(Object.fromEntries(formData));

  if (!idParsed.success || !parsed.success) {
    return { status: "error" };
  }

  const supabase = await createClient();

  // RLS (list_owner_update) guarantees only the owner can touch the row.
  const { error } = await supabase
    .from("list")
    .update(parsed.data)
    .eq("id", idParsed.data);

  if (error) {
    return { status: "error" };
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/dashboard/lists/${idParsed.data}`);
  return { status: "updated" };
}

export async function toggleAntiSpoil(
  listId: string,
  antiSpoil: boolean
): Promise<void> {
  const parsed = z
    .object({ id: z.string().uuid(), anti_spoil: z.boolean() })
    .safeParse({ id: listId, anti_spoil: antiSpoil });

  if (!parsed.success) {
    return;
  }

  const supabase = await createClient();

  await supabase
    .from("list")
    .update({ anti_spoil: parsed.data.anti_spoil })
    .eq("id", parsed.data.id);

  const locale = await getLocale();
  revalidatePath(`/${locale}/dashboard/lists/${parsed.data.id}`);
}

export async function deleteList(listId: string): Promise<void> {
  const parsed = z.string().uuid().safeParse(listId);

  if (!parsed.success) {
    return;
  }

  const supabase = await createClient();
  await supabase.from("list").delete().eq("id", parsed.data);

  const locale = await getLocale();
  revalidatePath(`/${locale}/dashboard`);
  redirect({ href: "/dashboard", locale });
}
