/**
 * Migrate JSON data → Supabase via REST API
 * No DB password needed — uses sb_secret key
 * Run: node --env-file=.env.local scripts/migrate-to-supabase.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const dataDir = join(process.cwd(), "src", "data");
const readJSON = (n) => JSON.parse(readFileSync(join(dataDir, n), "utf-8"));

const T = {
  hosts: "hayhome_hosts",
  reviews: "hayhome_reviews",
  bookings: "hayhome_bookings",
  users: "hayhome_users",
};

async function migrate() {
  // 1. HOSTS
  const hosts = readJSON("hosts.json");
  console.log(`📦 Hosts: ${hosts.length} records`);
  for (const host of hosts) {
    const { error } = await supabase.from(T.hosts).upsert(host, { onConflict: "id" });
    console.log(error ? `  ❌ ${host.id}: ${error.message}` : `  ✅ ${host.id}: ${host.familyName}`);
  }

  // 2. REVIEWS
  const reviews = readJSON("reviews.json");
  console.log(`\n📦 Reviews: ${reviews.length} records`);
  for (const review of reviews) {
    const { error } = await supabase.from(T.reviews).upsert(review, { onConflict: "id" });
    console.log(error ? `  ❌ ${review.id}: ${error.message}` : `  ✅ ${review.id}: ${review.guestName}`);
  }

  // 3. BOOKINGS
  const bookings = readJSON("bookings.json");
  console.log(`\n📦 Bookings: ${bookings.length} records`);
  for (const booking of bookings) {
    const { error } = await supabase.from(T.bookings).upsert(booking, { onConflict: "id" });
    if (error) console.log(`  ❌ ${booking.id}: ${error.message}`);
  }
  console.log(bookings.length ? `  ✅ ${bookings.length} bookings` : `  ⏭️  No bookings`);

  // 4. USERS
  const users = readJSON("users.json");
  console.log(`\n📦 Users: ${users.length} records`);
  for (const user of users) {
    const { error } = await supabase.from(T.users).upsert(user, { onConflict: "id" });
    console.log(error ? `  ❌ ${user.id}: ${error.message}` : `  ✅ ${user.id}: ${user.email}`);
  }

  // Verify
  console.log("\n🔍 Verification:");
  for (const [name, table] of Object.entries(T)) {
    const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
    console.log(error ? `  ❌ ${name}: ${error.message}` : `  📊 ${name}: ${count} rows`);
  }
  console.log("\n✅ Done!");
}

migrate().catch((err) => {
  console.error("💥 Fatal:", err);
  process.exit(1);
});
