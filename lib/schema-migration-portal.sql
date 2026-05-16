-- ScopeOS: Client Portal Expansion Migration
-- Run this in your Supabase SQL Editor

-- ============================================================
-- 1. Portal Files — client document uploads per project
-- ============================================================
CREATE TABLE IF NOT EXISTS portal_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  storage_path TEXT NOT NULL,
  uploaded_by TEXT DEFAULT 'client',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_portal_files_project
  ON portal_files(project_id, created_at);

-- ============================================================
-- 2. Enable RLS
-- ============================================================
ALTER TABLE portal_files ENABLE ROW LEVEL SECURITY;

-- Portal files are token-gated (not auth-gated), so allow public access
CREATE POLICY "Portal files are accessible" ON portal_files
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 3. Direct Messages — PM/Developer ↔ Client chat
-- ============================================================
CREATE TABLE IF NOT EXISTS direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('client', 'pm')),
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_direct_messages_project
  ON direct_messages(project_id, created_at);

ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Direct messages are accessible" ON direct_messages
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 4. Create storage bucket for portal files (run manually in Supabase dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portal-files', 'portal-files', true);
