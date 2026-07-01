-- Guest Requests table
CREATE TABLE IF NOT EXISTS hayhome_guest_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  region TEXT,
  date_from TEXT,
  date_to TEXT,
  guests_count INT DEFAULT 1,
  budget TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guest_requests_status ON hayhome_guest_requests(status);
CREATE INDEX IF NOT EXISTS idx_guest_requests_category ON hayhome_guest_requests(category);
CREATE INDEX IF NOT EXISTS idx_guest_requests_region ON hayhome_guest_requests(region);

-- Request Responses table (organizers respond to requests)
CREATE TABLE IF NOT EXISTS hayhome_request_responses (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL REFERENCES hayhome_guest_requests(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  price TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_request_responses_request_id ON hayhome_request_responses(request_id);
CREATE INDEX IF NOT EXISTS idx_request_responses_user_id ON hayhome_request_responses(user_id);
