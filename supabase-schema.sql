-- HayHome: Схема таблиц для Supabase
-- Выполнить в Supabase Dashboard → SQL Editor

-- ============================================
-- 1. TABLE: hosts
-- ============================================
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

-- ============================================
-- 2. TABLE: reviews
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  "hostId" TEXT NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
  "guestName" TEXT NOT NULL,
  "guestCountry" TEXT NOT NULL,
  rating SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT ''
);

-- ============================================
-- 3. TABLE: bookings
-- ============================================
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

-- ============================================
-- 4. TABLE: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
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
CREATE INDEX IF NOT EXISTS idx_hosts_region ON hosts(region);
CREATE INDEX IF NOT EXISTS idx_hosts_city ON hosts(city);
CREATE INDEX IF NOT EXISTS idx_hosts_status ON hosts(status);
CREATE INDEX IF NOT EXISTS idx_reviews_hostId ON reviews("hostId");
CREATE INDEX IF NOT EXISTS idx_bookings_hostId ON bookings("hostId");
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================
-- 6. RLS (Row Level Security)
-- ============================================
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Hosts: публичное чтение active, запись только через service_role
CREATE POLICY "hosts_public_read" ON hosts FOR SELECT USING (status = 'active');
CREATE POLICY "hosts_service_all" ON hosts FOR ALL USING (auth.role() = 'service_role');

-- Reviews: публичное чтение, запись через service_role
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_service_all" ON reviews FOR ALL USING (auth.role() = 'service_role');

-- Bookings: нет публичного чтения (приватные), только service_role
CREATE POLICY "bookings_service_all" ON bookings FOR ALL USING (auth.role() = 'service_role');

-- Users: нет публичного чтения, только service_role
CREATE POLICY "users_service_all" ON users FOR ALL USING (auth.role() = 'service_role');
