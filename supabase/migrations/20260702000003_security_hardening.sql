-- Hardening flagged by Supabase security advisors:
-- 1. Pin search_path on functions (mutable search_path = injection surface).
-- 2. Revoke EXECUTE on trigger functions from client roles — they are fired
--    by triggers only, never callable via /rest/v1/rpc. Triggers keep working:
--    Postgres does not check EXECUTE at fire time.

alter function public.set_updated_at() set search_path = public;
alter function public.sync_gift_status() set search_path = public;

revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.sync_gift_status() from public, anon, authenticated;
