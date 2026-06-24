-- Migration: Add standalone service booking columns
-- Run on Supabase SQL editor

-- Make booking_id nullable (standalone bookings don't have a host booking)
ALTER TABLE hayhome_service_bookings ALTER COLUMN booking_id DROP NOT NULL;

-- Add guest details for standalone bookings
ALTER TABLE hayhome_service_bookings
  ADD COLUMN IF NOT EXISTS guest_name VARCHAR(200),
  ADD COLUMN IF NOT EXISTS guest_phone VARCHAR(50),
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20) DEFAULT 'onsite';
