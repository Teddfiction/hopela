import "server-only";

import { createClient } from "@/lib/db/server";
import type { Gift, List } from "@/lib/db/types";

export interface ListWithGiftCount extends List {
  gift: { count: number }[];
}

export async function getMyLists(): Promise<ListWithGiftCount[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("list")
    .select("*, gift(count)")
    .order("created_at", { ascending: false });

  return (data as ListWithGiftCount[] | null) ?? [];
}

export async function getOwnedList(
  listId: string
): Promise<{ list: List; gifts: Gift[] } | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: list } = await supabase
    .from("list")
    .select("*")
    .eq("id", listId)
    .eq("owner_id", user.id)
    .single();

  if (!list) {
    return null;
  }

  const { data: gifts } = await supabase
    .from("gift")
    .select("*")
    .eq("list_id", listId)
    .order("position", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  return { list: list as List, gifts: (gifts as Gift[] | null) ?? [] };
}

export async function getPublicList(
  slug: string
): Promise<{ list: List; gifts: Gift[] } | null> {
  const supabase = await createClient();

  const { data: list } = await supabase
    .from("list")
    .select("*")
    .eq("public_slug", slug)
    .single();

  if (!list) {
    return null;
  }

  const { data: gifts } = await supabase
    .from("gift")
    .select("*")
    .eq("list_id", list.id)
    .order("position", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  return { list: list as List, gifts: (gifts as Gift[] | null) ?? [] };
}
