import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const sb = createClient(
  'https://fopcwaffkdolqwuzjkzy.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Tables must be created via Supabase Dashboard SQL Editor
// This script only adds columns to existing tables
async function migrate() {
  // ALTER users
  const { error: e1 } = await sb.rpc('query', {}).catch(() => ({}));
  console.log('Note: Run the migration SQL in Supabase Dashboard → SQL Editor');
  console.log('File: supabase-schema.sql (appended tables at the bottom)');
}

migrate();
