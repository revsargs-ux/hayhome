-- HayHome: Схема таблиц для Supabase (префикс hayhome_ чтобы не конфликтовать)
-- Выполнить в Supabase Dashboard → SQL Editor

-- ============================================
-- 1. TABLE: hayhome_hosts
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_hosts (
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

-- ============================================
-- 2. TABLE: hayhome_reviews
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_reviews (
  id TEXT PRIMARY KEY,
  "hostId" TEXT NOT NULL REFERENCES hayhome_hosts(id) ON DELETE CASCADE,
  "guestName" TEXT NOT NULL,
  "guestCountry" TEXT NOT NULL,
  rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT ''
);

-- ============================================
-- 3. TABLE: hayhome_bookings
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_bookings (
  id TEXT PRIMARY KEY,
  "hostId" TEXT NOT NULL REFERENCES hayhome_hosts(id) ON DELETE CASCADE,
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

-- ============================================
-- 4. TABLE: hayhome_users
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'host', 'admin')),
  "createdAt" TEXT NOT NULL DEFAULT ''
);

-- ============================================
-- 5. INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_hayhome_hosts_region ON hayhome_hosts(region);
CREATE INDEX IF NOT EXISTS idx_hayhome_hosts_city ON hayhome_hosts(city);
CREATE INDEX IF NOT EXISTS idx_hayhome_hosts_status ON hayhome_hosts(status);
CREATE INDEX IF NOT EXISTS idx_hayhome_reviews_hostId ON hayhome_reviews("hostId");
CREATE INDEX IF NOT EXISTS idx_hayhome_bookings_hostId ON hayhome_bookings("hostId");
CREATE INDEX IF NOT EXISTS idx_hayhome_bookings_status ON hayhome_bookings(status);
CREATE INDEX IF NOT EXISTS idx_hayhome_users_email ON hayhome_users(email);

-- ============================================
-- 6. RLS (Row Level Security)
-- ============================================
ALTER TABLE hayhome_hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hayhome_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hayhome_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hayhome_users ENABLE ROW LEVEL SECURITY;

-- host data is public (active only)
CREATE POLICY "hayhome_hosts_public_read" ON hayhome_hosts FOR SELECT USING (status = 'active');
-- reviews are public
CREATE POLICY "hayhome_reviews_public_read" ON hayhome_reviews FOR SELECT USING (true);
