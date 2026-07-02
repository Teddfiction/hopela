import "server-only";

/**
 * URL-safe slug from a list title + short random suffix.
 * Uniqueness is guaranteed by the DB unique index; callers retry on collision.
 */
export function generateSlug(title: string): string {
  const base = title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 6);

  return base ? `${base}-${suffix}` : suffix;
}
