-- SQL для Supabase: атомарные RPC функции для partner balance

-- 1. Deduct balance (atomic, prevents negative balance)
CREATE OR REPLACE FUNCTION deduct_partner_balance(p_partner_id UUID, p_amount NUMERIC)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance NUMERIC;
BEGIN
  SELECT balance INTO current_balance FROM hayhome_partners WHERE id = p_partner_id FOR UPDATE;
  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'Partner not found';
  END IF;
  IF current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;
  UPDATE hayhome_partners SET balance = balance - p_amount WHERE id = p_partner_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Credit balance (for rollback)
CREATE OR REPLACE FUNCTION credit_partner_balance(p_partner_id UUID, p_amount NUMERIC)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE hayhome_partners SET balance = balance + p_amount WHERE id = p_partner_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atomic booking creation (prevents race condition on double-booking)
CREATE OR REPLACE FUNCTION create_booking_atomic(
  p_host_id TEXT,
  p_dates TEXT[],
  p_guest_name TEXT,
  p_guest_email TEXT,
  p_guest_phone TEXT,
  p_guest_country TEXT,
  p_check_in TEXT,
  p_check_out TEXT,
  p_guests INT,
  p_total_price NUMERIC,
  p_message TEXT
)
RETURNS UUID AS $$
DECLARE
  booking_id UUID;
  conflict_count INT;
BEGIN
  -- Check for conflicts with row lock
  SELECT COUNT(*) INTO conflict_count
  FROM hayhome_calendar
  WHERE host_id = p_host_id
    AND date = ANY(p_dates)
    AND status IN ('booked', 'blocked')
  FOR UPDATE;

  IF conflict_count > 0 THEN
    RAISE EXCEPTION 'Dates not available';
  END IF;

  -- Create booking
  INSERT INTO hayhome_bookings (hostId, hostName, guestName, guestEmail, guestPhone, guestCountry, checkIn, checkOut, guests, totalPrice, message, status)
  VALUES (p_host_id, '', p_guest_name, p_guest_email, p_guest_phone, p_guest_country, p_check_in, p_check_out, p_guests, p_total_price, p_message, 'pending')
  RETURNING id INTO booking_id;

  -- Lock calendar dates
  INSERT INTO hayhome_calendar (host_id, date, status, booking_id)
  SELECT p_host_id, d, 'booked', booking_id FROM UNNEST(p_dates) AS d
  ON CONFLICT (host_id, date) DO UPDATE SET status = 'booked', booking_id = booking_id;

  RETURN booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
