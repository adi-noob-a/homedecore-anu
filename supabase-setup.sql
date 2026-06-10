-- ─── Interior Design Hub — Supabase Setup ───
-- Run this SQL in your Supabase project's SQL Editor to create the required table.
-- Then enable Row Level Security (RLS) for client-safe inserts.

-- 1. Create the calculations_ledger table
CREATE TABLE IF NOT EXISTS calculations_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL CHECK (char_length(client_name) >= 2),
  client_email TEXT NOT NULL CHECK (client_email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  client_phone TEXT NOT NULL CHECK (client_phone ~ '^[0-9]{10}$'),
  timeline TEXT NOT NULL CHECK (timeline IN ('immediate', '1-3-months', 'planning')),
  configuration_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  estimated_total_cost NUMERIC(12, 2) NOT NULL CHECK (estimated_total_cost >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_calculations_ledger_created_at ON calculations_ledger (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calculations_ledger_client_email ON calculations_ledger (client_email);

-- 3. Enable Row Level Security
ALTER TABLE calculations_ledger ENABLE ROW LEVEL SECURITY;

-- 4. Create an RLS policy allowing anonymous inserts (safe because anon key is restricted by schema)
--    This lets the client-side Supabase anon key insert rows without auth.
CREATE POLICY "Allow anonymous inserts on calculations_ledger"
  ON calculations_ledger
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5. Optionally, prevent anonymous users from SELECTING data
CREATE POLICY "Prevent anonymous reads on calculations_ledger"
  ON calculations_ledger
  FOR SELECT
  TO anon
  USING (false);

-- ─── Done ───
-- After running this:
-- 1. Copy your Supabase project URL and anon key into .env.local
-- 2. Deploy to Vercel with the same env vars
-- 3. The calculator will automatically save submissions to this table
