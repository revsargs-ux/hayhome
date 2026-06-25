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
  role TEXT NOT NULL DEFAULT 'guest' CHECK (role IN ('guest', 'host', 'admin', 'provider')),
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

-- ============================================
-- 5. TABLE: hayhome_partners
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_partners (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES hayhome_users(id),
  role TEXT NOT NULL CHECK (role IN ('ambassador', 'hunter', 'regional')),
  region TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'suspended')),
  balance NUMERIC DEFAULT 0,
  total_earned NUMERIC DEFAULT 0,
  total_withdrawn NUMERIC DEFAULT 0,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_partners_user ON hayhome_partners(user_id);
CREATE INDEX idx_partners_code ON hayhome_partners(code);

-- ============================================
-- 6. TABLE: hayhome_referrals
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_referrals (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL REFERENCES hayhome_partners(id),
  referred_user_id TEXT NOT NULL REFERENCES hayhome_users(id),
  type TEXT NOT NULL DEFAULT 'guest' CHECK (type IN ('guest', 'host', 'experience')),
  referred_entity_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'fraud')),
  first_booking_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_referrals_partner ON hayhome_referrals(partner_id);
CREATE INDEX idx_referrals_user ON hayhome_referrals(referred_user_id);

-- ============================================
-- 7. TABLE: hayhome_payouts
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_payouts (
  id TEXT PRIMARY KEY,
  partner_id TEXT NOT NULL REFERENCES hayhome_partners(id),
  amount NUMERIC NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('idram', 'bank_transfer', 'crypto')),
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  note TEXT
);
CREATE INDEX idx_payouts_partner ON hayhome_payouts(partner_id);

-- ============================================
-- ALTER: add referral fields to existing tables
-- ============================================
ALTER TABLE hayhome_users ADD COLUMN IF NOT EXISTS referred_by TEXT;
ALTER TABLE hayhome_users ADD COLUMN IF NOT EXISTS referred_by_code TEXT;
ALTER TABLE hayhome_bookings ADD COLUMN IF NOT EXISTS commission_partner NUMERIC DEFAULT 0;
ALTER TABLE hayhome_bookings ADD COLUMN IF NOT EXISTS partner_id TEXT;

-- RLS for partners
ALTER TABLE hayhome_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE hayhome_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hayhome_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read partners by code" ON hayhome_partners FOR SELECT USING (true);
CREATE POLICY "Partners can read own referrals" ON hayhome_referrals FOR SELECT USING (true);
CREATE POLICY "Partners can read own payouts" ON hayhome_payouts FOR SELECT USING (true);
CREATE POLICY "Service role full access partners" ON hayhome_partners FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access referrals" ON hayhome_referrals FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access payouts" ON hayhome_payouts FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 8. TABLE: hayhome_services
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_services (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL REFERENCES hayhome_users(id),
  category TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC NOT NULL DEFAULT 0,
  price_unit TEXT NOT NULL DEFAULT 'per_event' CHECK (price_unit IN ('per_hour', 'per_event', 'per_person')),
  min_duration INTEGER NOT NULL DEFAULT 1,
  max_duration INTEGER NOT NULL DEFAULT 8,
  photos JSONB DEFAULT '[]',
  region TEXT NOT NULL DEFAULT '',
  available BOOLEAN NOT NULL DEFAULT TRUE,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_services_provider ON hayhome_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON hayhome_services(category);
CREATE INDEX IF NOT EXISTS idx_services_region ON hayhome_services(region);
ALTER TABLE hayhome_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hayhome_services_public_read" ON hayhome_services FOR SELECT USING (true);
CREATE POLICY "Service role full access services" ON hayhome_services FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 9. TABLE: hayhome_service_bookings
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_service_bookings (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES hayhome_bookings(id) ON DELETE SET NULL,
  service_id TEXT NOT NULL REFERENCES hayhome_services(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'cancelled', 'completed')),
  total_price NUMERIC NOT NULL DEFAULT 0,
  client_note TEXT NOT NULL DEFAULT '',
  time_of_day TEXT,
  custom_time TEXT,
  guest_name TEXT,
  guest_phone TEXT,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_service_bookings_service ON hayhome_service_bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_booking ON hayhome_service_bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_service_bookings_status ON hayhome_service_bookings(status);
ALTER TABLE hayhome_service_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access service_bookings" ON hayhome_service_bookings FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 10. TABLE: hayhome_messages
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_messages (
  id TEXT PRIMARY KEY,
  from_user_id TEXT NOT NULL REFERENCES hayhome_users(id),
  to_user_id TEXT NOT NULL REFERENCES hayhome_users(id),
  booking_id TEXT REFERENCES hayhome_bookings(id) ON DELETE SET NULL,
  service_id TEXT,
  text TEXT NOT NULL DEFAULT '',
  media_url TEXT,
  media_type TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_messages_from ON hayhome_messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_to ON hayhome_messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_booking ON hayhome_messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON hayhome_messages(created_at);
ALTER TABLE hayhome_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access messages" ON hayhome_messages FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 11. TABLE: hayhome_favorites
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES hayhome_users(id) ON DELETE CASCADE,
  host_id TEXT NOT NULL REFERENCES hayhome_hosts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, host_id)
);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON hayhome_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_host ON hayhome_favorites(host_id);
ALTER TABLE hayhome_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access favorites" ON hayhome_favorites FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 12. TABLE: hayhome_calendar
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_calendar (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL REFERENCES hayhome_hosts(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'blocked', 'booked')),
  note TEXT,
  UNIQUE(host_id, date)
);
CREATE INDEX IF NOT EXISTS idx_calendar_host ON hayhome_calendar(host_id);
CREATE INDEX IF NOT EXISTS idx_calendar_date ON hayhome_calendar(date);
ALTER TABLE hayhome_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hayhome_calendar_public_read" ON hayhome_calendar FOR SELECT USING (true);
CREATE POLICY "Service role full access calendar" ON hayhome_calendar FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 13. TABLE: hayhome_payments
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_payments (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES hayhome_bookings(id) ON DELETE SET NULL,
  service_booking_id TEXT REFERENCES hayhome_service_bookings(id) ON DELETE SET NULL,
  user_id TEXT NOT NULL REFERENCES hayhome_users(id),
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  provider_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_user ON hayhome_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON hayhome_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON hayhome_payments(status);
ALTER TABLE hayhome_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access payments" ON hayhome_payments FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 14. TABLE: hayhome_promocodes
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_promocodes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL DEFAULT 0,
  min_amount NUMERIC NOT NULL DEFAULT 0,
  max_uses INTEGER,
  uses_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_by TEXT REFERENCES hayhome_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_promocodes_code ON hayhome_promocodes(code);
ALTER TABLE hayhome_promocodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access promocodes" ON hayhome_promocodes FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 15. TABLE: hayhome_host_history
-- ============================================
CREATE TABLE IF NOT EXISTS hayhome_host_history (
  id TEXT PRIMARY KEY,
  host_id TEXT NOT NULL REFERENCES hayhome_hosts(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_host_history_host ON hayhome_host_history(host_id);
CREATE INDEX IF NOT EXISTS idx_host_history_created ON hayhome_host_history(created_at);
ALTER TABLE hayhome_host_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access host_history" ON hayhome_host_history FOR ALL USING (auth.role() = 'service_role');
