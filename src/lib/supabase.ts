import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Server-side Supabase client (service role — bypasses RLS).
 * Use ONLY in server-side code (API routes, server components).
 */
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
