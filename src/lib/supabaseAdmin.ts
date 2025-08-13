import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(
  import.meta.env.SUPABASE_URL!,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY!, // Must be the service_role key
  { auth: { persistSession: false } }
);