import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — BYPASSES RLS.
 *
 * Server-only by construction (`server-only` import): bundling this file
 * into a client component fails the build. Used exclusively for:
 *  - reservation reads/writes (table locked to client keys),
 *  - user profile provisioning on first sign-in.
 *
 * Never expose data fetched with this client without explicit
 * serialization rules (docs/DATA_MODEL.md §4).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
