-- ScopeOS: Single-Step Project Creation Migration
-- Run this in your Supabase SQL Editor

-- Add portal_token column for unique, shareable portal URLs
ALTER TABLE projects ADD COLUMN IF NOT EXISTS portal_token TEXT UNIQUE;

-- Add portal_enabled flag (default ON)
ALTER TABLE projects ADD COLUMN IF NOT EXISTS portal_enabled BOOLEAN DEFAULT true;

-- Create index for fast token lookups
CREATE INDEX IF NOT EXISTS idx_projects_portal_token ON projects (portal_token);

-- Backfill existing projects with generated tokens
UPDATE projects
SET portal_token = gen_random_uuid()::text
WHERE portal_token IS NULL;
