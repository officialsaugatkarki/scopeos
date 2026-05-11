-- ScopeOS: AI Chat Portal Migration
-- Run this in your Supabase SQL Editor

-- ============================================================
-- 1. Portal Messages — chat history per project
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('client', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portal_messages_project ON portal_messages(project_id, created_at);

-- ============================================================
-- 2. Agency Pricing — per-agency pricing rules for AI context
-- ============================================================
CREATE TABLE IF NOT EXISTS agency_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hourly_rate NUMERIC DEFAULT 150,
  currency TEXT DEFAULT 'USD',
  min_hours NUMERIC DEFAULT 1,
  overage_multiplier NUMERIC DEFAULT 1.5,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================
-- 3. Add ai_context column to projects
-- ============================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS ai_context JSONB DEFAULT '{}';

-- ============================================================
-- 4. Enable RLS (optional, recommended)
-- ============================================================
ALTER TABLE portal_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_pricing ENABLE ROW LEVEL SECURITY;

-- Allow public read/write on portal_messages (portal is token-gated, not auth-gated)
CREATE POLICY "Portal messages are accessible" ON portal_messages
  FOR ALL USING (true) WITH CHECK (true);

-- Agency pricing only accessible by owner
CREATE POLICY "Users can manage their pricing" ON agency_pricing
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
