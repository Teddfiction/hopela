-- Hopélà! — initial schema
-- See docs/DATA_MODEL.md. Tables snake_case, RLS enabled in the next migration.

create type gift_status as enum ('available', 'reserved');

-- 3.1 user — public profile mirror of auth.users
create table "user" (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text,
  locale text not null default 'fr',
  country text not null default 'FR',
  created_at timestamptz not null default now()
);

-- 3.2 list
create table list (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references "user" (id) on delete cascade,
  title text not null,
  emoji text,
  description text,
  event_date date,
  cover_image text check (
    cover_image in ('confetti', 'balloons', 'gift', 'stars', 'hearts', 'flowers')
  ),
  public_slug text not null,
  anti_spoil boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index list_public_slug_key on list (public_slug);
create index list_owner_id_idx on list (owner_id);

-- 3.3 gift
create table gift (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references list (id) on delete cascade,
  url text,
  title text not null,
  description text,
  price numeric(10, 2),
  currency text,
  image_url text,
  is_top_priority boolean not null default false,
  status gift_status not null default 'available',
  position integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gift_list_id_idx on gift (list_id);
create index gift_list_id_status_idx on gift (list_id, status);

-- 3.4 reservation — sensitive table (reserver_email is server-only)
create table reservation (
  id uuid primary key default gen_random_uuid(),
  gift_id uuid not null references gift (id) on delete cascade,
  reserver_name text not null,
  reserver_email text not null,
  cancel_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  constraint reservation_gift_id_key unique (gift_id),
  constraint reservation_cancel_token_key unique (cancel_token)
);

-- updated_at bump — shared trigger for list and gift
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_list_updated_at
  before update on list
  for each row execute function set_updated_at();

create trigger trg_gift_updated_at
  before update on gift
  for each row execute function set_updated_at();

-- gift.status ↔ reservation consistency (DB-owned, not app code)
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
