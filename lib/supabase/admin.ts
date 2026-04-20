import { createClient } from '@supabase/supabase-js';

// This client uses the SERVICE_ROLE_KEY, which bypasses RLS.
// ONLY use this in Server Components or API Routes.
// NEVER expose this to the client.

export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
