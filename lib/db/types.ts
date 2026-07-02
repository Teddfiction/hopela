export type GiftStatus = "available" | "reserved";

export type CoverImage =
  | "confetti"
  | "balloons"
  | "gift"
  | "stars"
  | "hearts"
  | "flowers";

export interface UserProfile {
  id: string;
  email: string;
  first_name: string | null;
  locale: string;
  country: string;
  created_at: string;
}

export interface List {
  id: string;
  owner_id: string;
  title: string;
  emoji: string | null;
  description: string | null;
  event_date: string | null;
  cover_image: CoverImage | null;
  public_slug: string;
  anti_spoil: boolean;
  created_at: string;
  updated_at: string;
}

export interface Gift {
  id: string;
  list_id: string;
  url: string | null;
  title: string;
  description: string | null;
  price: string | null;
  currency: string | null;
  image_url: string | null;
  is_top_priority: boolean;
  status: GiftStatus;
  position: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Client-safe projection of a gift on the public list page.
 * `reserverName` is populated only when the list has anti_spoil = false.
 * `reserver_email` never leaves the server (docs/DATA_MODEL.md §4).
 */
export interface PublicGift extends Gift {
  reserverName: string | null;
}
