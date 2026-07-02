# DATA MODEL — Hopélà!

> Companion to `SPEC.md`. Defines the database schema, constraints, and **Row-Level Security (RLS)**.
> Engine: **PostgreSQL (Supabase)**. Tables **snake_case**, one concept per table. RLS enabled on **every** table.

---

## 1. Entity overview

```
auth.users (Supabase)
     │ 1:1
     ▼
  user ────1:N────▶ list ────1:N────▶ gift ────1:1────▶ reservation
```

- A **user** owns 0..N **lists** (created on first magic-link sign-in).
- A **list** holds 0..N **gifts**.
- A **gift** has 0..1 **reservation** (1 max, enforced by `unique (gift_id)`).
- **Contributors are NOT users** — name + email stored on `reservation`, no account.

---

## 2. Enums

```sql
create type gift_status as enum ('available', 'reserved');
```

`cover_image` is a **gallery key** (predefined assets, no uploads): `text` + `check` constraint; promote to a lookup table only if the gallery grows.

---

## 3. Tables

### 3.1 `user` — public profile mirror of `auth.users`

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | ✗ | — | **PK**, FK → `auth.users(id)` on delete cascade |
| `email` | `text` | ✗ | — | from auth |
| `first_name` | `text` | ✓ | — | optional |
| `locale` | `text` | ✗ | `'fr'` | drives i18n |
| `country` | `text` | ✗ | — | ISO-3166 alpha-2; drives currency |
| `created_at` | `timestamptz` | ✗ | `now()` | |

### 3.2 `list`

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | ✗ | `gen_random_uuid()` | **PK** |
| `owner_id` | `uuid` | ✗ | — | FK → `user(id)` on delete cascade |
| `title` | `text` | ✗ | — | |
| `emoji` | `text` | ✓ | — | single emoji |
| `description` | `text` | ✓ | — | markdown |
| `event_date` | `date` | ✓ | — | informational — **no deadline logic** |
| `cover_image` | `text` | ✓ | — | gallery key, `check (cover_image in (...))` |
| `public_slug` | `text` | ✗ | — | **unique**, auto-generated |
| `anti_spoil` | `boolean` | ✗ | `true` | per-list toggle |
| `created_at` | `timestamptz` | ✗ | `now()` | |
| `updated_at` | `timestamptz` | ✗ | `now()` | bump via trigger |

Indexes: `unique (public_slug)` · `(owner_id)`.

### 3.3 `gift`

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | ✗ | `gen_random_uuid()` | **PK** |
| `list_id` | `uuid` | ✗ | — | FK → `list(id)` on delete cascade |
| `url` | `text` | ✓ | — | primary input; triggers OG unfurl |
| `title` | `text` | ✗ | — | auto-filled, overridable |
| `description` | `text` | ✓ | — | auto-filled |
| `price` | `numeric(10,2)` | ✓ | — | estimated — never float |
| `currency` | `text` | ✓ | — | derived from list country |
| `image_url` | `text` | ✓ | — | auto-filled or external |
| `is_top_priority` | `boolean` | ✗ | `false` | badge |
| `status` | `gift_status` | ✗ | `'available'` | synced with `reservation` (§5) |
| `position` | `integer` | ✓ | — | manual ordering |
| `created_at` | `timestamptz` | ✗ | `now()` | |
| `updated_at` | `timestamptz` | ✗ | `now()` | |

Indexes: `(list_id)` · `(list_id, status)`.

### 3.4 `reservation` — **sensitive table**

`reserver_email` must never reach any client; `reserver_name` only when `anti_spoil = false`. Enforced by RLS lock **and** server serialization (§4).

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | ✗ | `gen_random_uuid()` | **PK** |
| `gift_id` | `uuid` | ✗ | — | FK → `gift(id)` on delete cascade — **unique** → 1 reservation per gift |
| `reserver_name` | `text` | ✗ | — | free text, unverified |
| `reserver_email` | `text` | ✗ | — | **server-only, never serialized to client** |
| `cancel_token` | `uuid` | ✗ | `gen_random_uuid()` | **unique**; self-cancel link, never expires |
| `created_at` | `timestamptz` | ✗ | `now()` | |

Constraints: `unique (gift_id)` · `unique (cancel_token)`. No duplicate-email check (SPEC).

---

## 4. Security model — RLS + server boundary

1. **The service role bypasses RLS.** All mutations and sensitive reads run server-side with the service role. RLS protects against anything that could reach a browser (anon/authenticated keys).
2. **RLS is row-level, not column-level.** Column secrecy (`reserver_email`, conditional `reserver_name`) is enforced at the **server serialization layer**.

**Anti-spoil, two layers:**
- **Layer 1 — RLS:** `reservation` is fully locked to clients (no policies → denied by default). A leaked client key reveals nothing.
- **Layer 2 — Server serialization:** the public page reads reservations server-side and emits at most `reserver_name`, only when `anti_spoil = false`. `reserver_email` is never selected into a client-bound payload. "Reserved" display reads `gift.status`, so the public page rarely touches the reservation row at all.

---

## 5. Gift status ↔ reservation consistency

`gift.status` is denormalized for cheap public reads; a DB trigger keeps it truthful (not app code):

```sql
create or replace function sync_gift_status() returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update gift set status = 'reserved', updated_at = now() where id = new.gift_id;
  elsif (tg_op = 'DELETE') then
    update gift set status = 'available', updated_at = now() where id = old.gift_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger trg_sync_gift_status
  after insert or delete on reservation
  for each row execute function sync_gift_status();
```

`unique (gift_id)` guarantees the 1-reservation rule under concurrency: the second insert fails → server returns "already reserved".

---

## 6. RLS policies

```sql
-- user: read/update own row only; inserts server-side on first sign-in
alter table "user" enable row level security;
create policy user_select_own on "user" for select using (auth.uid() = id);
create policy user_update_own on "user" for update using (auth.uid() = id);

-- list: public read (needed for /list/[slug]); owner-only writes
alter table list enable row level security;
create policy list_public_read on list for select using (true);
create policy list_owner_write on list for all
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- gift: public read (status drives display); list-owner-only writes
alter table gift enable row level security;
create policy gift_public_read on gift for select using (true);
create policy gift_owner_write on gift for all
  using (exists (select 1 from list l where l.id = gift.list_id and l.owner_id = auth.uid()))
  with check (exists (select 1 from list l where l.id = gift.list_id and l.owner_id = auth.uid()));

-- reservation: LOCKED — no anon/authenticated policies, all client access denied.
-- Reads and writes run server-side via service role only.
alter table reservation enable row level security;
```

---

## 7. Server-side operations (service role)

| Operation | Surface | DB effect |
|---|---|---|
| Reserve a gift | Server Action | insert `reservation` (unique gift_id guards races) → trigger sets `gift.status = 'reserved'` → confirmation email with `cancel_token` link |
| Self-cancel | API Route (email link) | delete `reservation` by `cancel_token` → trigger sets `gift.status = 'available'` |
| Render public list | Server read | `list` + `gift` (public); add `reserver_name` only if `anti_spoil = false`; never select `reserver_email` |

---

## 8. Migrations & conventions

- Supabase CLI, one migration per change, checked in. No dashboard schema edits.
- `updated_at` via a shared `set_updated_at()` trigger on `list` and `gift`.
- FKs `on delete cascade` down the chain (user → lists → gifts → reservations).
- Money: `numeric(10,2)` + `currency`, never floats.

---

## 9. Open / Deferred

- **RGPD** — `reserver_email` and `email` are PII: retention, consent, residency → post-V1 study.
- **Group gifting** — would break `unique (gift_id)` (1→N). Out of scope; the constraint is a conscious decision.
- **Third-party cancellation** — dropped from V1; would reintroduce a `cancellation_request` table (tokens + 72h expiry) as a purely additive change.
