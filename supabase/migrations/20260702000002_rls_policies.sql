-- Hopélà! — RLS on every table (docs/DATA_MODEL.md §6)
-- reservation stays LOCKED: RLS enabled, zero policies for anon/authenticated.
-- All reservation reads/writes run server-side via the service role.

-- user: read/update own row only; inserts happen server-side on first sign-in
alter table "user" enable row level security;

create policy user_select_own on "user"
  for select using ((select auth.uid()) = id);

create policy user_update_own on "user"
  for update using ((select auth.uid()) = id);

-- list: public read (needed for /list/[slug]); owner-only writes
alter table list enable row level security;

create policy list_public_read on list
  for select using (true);

create policy list_owner_insert on list
  for insert with check ((select auth.uid()) = owner_id);

create policy list_owner_update on list
  for update using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy list_owner_delete on list
  for delete using ((select auth.uid()) = owner_id);

-- gift: public read (status drives display); list-owner-only writes
alter table gift enable row level security;

create policy gift_public_read on gift
  for select using (true);

create policy gift_owner_insert on gift
  for insert with check (
    exists (
      select 1 from list l
      where l.id = gift.list_id and l.owner_id = (select auth.uid())
    )
  );

create policy gift_owner_update on gift
  for update using (
    exists (
      select 1 from list l
      where l.id = gift.list_id and l.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from list l
      where l.id = gift.list_id and l.owner_id = (select auth.uid())
    )
  );

create policy gift_owner_delete on gift
  for delete using (
    exists (
      select 1 from list l
      where l.id = gift.list_id and l.owner_id = (select auth.uid())
    )
  );

-- reservation: LOCKED — deny-by-default for all client keys
alter table reservation enable row level security;
