// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// Read from environment at runtime (Astro exposes import.meta.env.*)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string;

// Client is safe on the client with ANON key.
// Never ship service_role to the browser.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);