/**
 * Create tables + migrate data: JSON → Supabase PostgreSQL
 * Run: node --env-file=.env.local scripts/setup-supabase.mjs
 */
import pg from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const { Pool } = pg;

// Supabase pooler connection
const pool = new Pool({
  host: "aws-0-eu-central-1.pooler.supabase.com",
  port: 5432,
  database: "postgres",
  user: "postgres.fopcwaffkdolqwuzjkzy",
  password: process.env.SUPABASE_DB_PASSWORD || "",
  ssl: { rejectUnauthorized: false },
});

const dataDir = join(process.cwd(), "src", "data");
const readJSON = (n) => JSON.parse(readFileSync(join(dataDir, n), "utf-8"));

const SCHEMA_SQL = `
-- Hosts
CREATE TABLE IF NOT EXISTS hosts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "familyName" TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  stars SMALLINT NOT NULL DEFAULT 1 CHECK (stars BETWEEN 1 AND 5),
  "pricePerNight" INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  "longDescription" TEXT NOT NULL DEFAULT '',
  i18n JSONB DEFAULT '{}',
  "coverPhoto" TEXT NOT NULL DEFAULT '',
  photos JSONB DEFAULT '[]',
  badges JSONB DEFAULT '[]',
  languages JSONB DEFAULT '[]',
  amenities JSONB DEFAULT '[]',
  experiences JSONB DEFAULT '[]',
  "maxGuests" INTEGER NOT NULL DEFAULT 1,
  "availableRooms" INTEGER NOT NULL DEFAULT 1,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  "createdAt" TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended'))
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  "hostId" TEXT NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
  "guestName" TEXT NOT NULL,
  "guestCountry" TEXT NOT NULL,
  rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT ''
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  "hostId" TEXT NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
  "hostName" TEXT NOT NULL,
  "guestName" TEXT NOT NULL,
  "guestEmail" TEXT NOT NULL,
  "guestPhone" TEXT NOT NULL,
  "guestCountry" TEXT NOT NULL,
  "checkIn" TEXT NOT NULL,
  "checkOut" TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1,
  "totalPrice" INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  message TEXT NOT NULL DEFAULT '',
  "createdAt" TEXT NOT NULL DEFAULT ''
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'host', 'admin')),
  "createdAt" TEXT NOT NULL DEFAULT ''
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hosts_region ON hosts(region);
CREATE INDEX IF NOT EXISTS idx_hosts_city ON hosts(city);
CREATE INDEX IF NOT EXISTS idx_hosts_status ON hosts(status);
CREATE INDEX IF NOT EXISTS idx_reviews_hostId ON reviews("hostId");
CREATE INDEX IF NOT EXISTS idx_bookings_hostId ON bookings("hostId");
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- RLS
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies (service_role bypasses RLS automatically)
DO $$ BEGIN
  CREATE POLICY "hosts_public_read" ON hosts FOR SELECT USING (status = 'active');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
`;

async function main() {
  const client = await pool.connect();

  try {
    console.log("🔧 Creating tables and RLS...\n");
    await client.query(SCHEMA_SQL);
    console.log("✅ Tables created\n");

    // Migrate hosts
    const hosts = readJSON("hosts.json");
    console.log(`📦 Migrating ${hosts.length} hosts...`);
    for (const h of hosts) {
      const cols = Object.keys(h).map(k => `"${k}"`).join(",");
      const vals = Object.keys(h).map((_, i) => `$${i + 1}`).join(",");
      await client.query(
        `INSERT INTO hosts (${cols}) VALUES (${vals}) ON CONFLICT (id) DO UPDATE SET ${Object.keys(h).map(k => `"${k}"=EXCLUDED."${k}"`).join(",")}`,
        Object.values(h)
      );
      console.log(`  ✅ ${h.id}: ${h.familyName}`);
    }

    // Migrate reviews
    const reviews = readJSON("reviews.json");
    console.log(`\n📦 Migrating ${reviews.length} reviews...`);
    for (const r of reviews) {
      const cols = Object.keys(r).map(k => `"${k}"`).join(",");
      const vals = Object.keys(r).map((_, i) => `$${i + 1}`).join(",");
      await client.query(
        `INSERT INTO reviews (${cols}) VALUES (${vals}) ON CONFLICT (id) DO UPDATE SET ${Object.keys(r).map(k => `"${k}"=EXCLUDED."${k}"`).join(",")}`,
        Object.values(r)
      );
      console.log(`  ✅ ${r.id}: ${r.guestName}`);
    }

    // Migrate bookings
    const bookings = readJSON("bookings.json");
    console.log(`\n📦 Migrating ${bookings.length} bookings...`);
    for (const b of bookings) {
      const cols = Object.keys(b).map(k => `"${k}"`).join(",");
      const vals = Object.keys(b).map((_, i) => `$${i + 1}`).join(",");
      await client.query(
        `INSERT INTO bookings (${cols}) VALUES (${vals}) ON CONFLICT (id) DO UPDATE SET ${Object.keys(b).map(k => `"${k}"=EXCLUDED."${k}"`).join(",")}`,
        Object.values(b)
      );
    }
    console.log(bookings.length ? `  ✅ ${bookings.length} bookings` : `  ⏭️ No bookings`);

    // Migrate users
    const users = readJSON("users.json");
    console.log(`\n📦 Migrating ${users.length} users...`);
    for (const u of users) {
      const cols = Object.keys(u).map(k => `"${k}"`).join(",");
      const vals = Object.keys(u).map((_, i) => `$${i + 1}`).join(",");
      await client.query(
        `INSERT INTO users (${cols}) VALUES (${vals}) ON CONFLICT (id) DO UPDATE SET ${Object.keys(u).map(k => `"${k}"=EXCLUDED."${k}"`).join(",")}`,
        Object.values(u)
      );
      console.log(`  ✅ ${u.id}: ${u.email}`);
    }

    // Verify
    console.log("\n🔍 Verification:");
    for (const t of ["hosts", "reviews", "bookings", "users"]) {
      const { rows } = await client.query(`SELECT COUNT(*)::int as c FROM ${t}`);
      console.log(`  📊 ${t}: ${rows[0].c} rows`);
    }

    console.log("\n✅ Migration complete!");
  } catch (err) {
    console.error("💥 Error:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
