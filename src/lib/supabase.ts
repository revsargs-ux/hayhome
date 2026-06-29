import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Server-side Supabase client (service role — bypasses RLS).
 * Lazy singleton — only creates client on first actual use, not at import time.
 */
export function getSupabase(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Supabase env vars not configured");
    }
    _client = createClient(url, key, { auth: { persistSession: false } });
  }
  return _client;
}

// Proxy wrapper for backward-compatible `import { supabase } from '@/lib/supabase'`
// Resolves on first property access at runtime, not at build time.
export const supabase: SupabaseClient = new Proxy(
  {},
  {
    get(_target, prop) {
      return Reflect.get(getSupabase(), prop);
    },
    has(_target, prop) {
      return Reflect.has(getSupabase(), prop);
    },
    ownKeys() {
      return Reflect.ownKeys(getSupabase());
    },
    getOwnPropertyDescriptor(_target, prop) {
      return Reflect.getOwnPropertyDescriptor(getSupabase(), prop);
    },
  }
) as SupabaseClient;
