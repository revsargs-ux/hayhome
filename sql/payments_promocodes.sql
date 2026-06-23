-- HayHome: Payments, Promocodes tables
-- Run in Supabase SQL Editor

-- Payments table
CREATE TABLE IF NOT EXISTS hayhome_payments (
  id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
  booking_id text REFERENCES hayhome_bookings(id),
  service_booking_id text REFERENCES hayhome_service_bookings(id),
  user_id text NOT NULL REFERENCES hayhome_users(id),
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  method text NOT NULL DEFAULT 'stripe',
  status text NOT NULL DEFAULT 'pending',
  provider_payment_id text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Promocodes table
CREATE TABLE IF NOT EXISTS hayhome_promocodes (
  id text DEFAULT gen_random_uuid()::text PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL DEFAULT 'percent',
  discount_value numeric NOT NULL DEFAULT 0,
  min_amount numeric DEFAULT 0,
  max_uses integer DEFAULT NULL,
  used_count integer DEFAULT 0,
  active boolean DEFAULT true,
  expires_at timestamptz DEFAULT NULL,
  created_by text REFERENCES hayhome_users(id),
  created_at timestamptz DEFAULT now()
);

-- Add promo_code column to bookings (if not exists)
ALTER TABLE hayhome_bookings ADD COLUMN IF NOT EXISTS promo_code text DEFAULT NULL;
ALTER TABLE hayhome_bookings ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0;
