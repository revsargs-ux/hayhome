-- Error tracking table
CREATE TABLE IF NOT EXISTS hayhome_errors (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  level TEXT DEFAULT 'error',
  message TEXT,
  stack TEXT,
  url TEXT,
  method TEXT,
  status INT,
  user_id TEXT,
  user_agent TEXT,
  ip TEXT,
  context JSONB
);

-- Index for querying recent errors
CREATE INDEX IF NOT EXISTS idx_hayhome_errors_timestamp ON hayhome_errors(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_hayhome_errors_level ON hayhome_errors(level);

-- Enable RLS
ALTER TABLE hayhome_errors ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (admin via API)
CREATE POLICY "Service role full access" ON hayhome_errors
  FOR ALL USING (auth.role() = 'service_role');
