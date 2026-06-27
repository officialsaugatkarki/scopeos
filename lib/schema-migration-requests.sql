-- ScopeOS: Unified Requests Migration
-- Run this in your Supabase SQL Editor

-- Create the unified requests table
CREATE TABLE IF NOT EXISTS requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  client_id TEXT,
  message TEXT NOT NULL,
  ai_decision TEXT,
  confidence_score NUMERIC,
  reasoning TEXT,
  estimated_impact TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_requests_project_id ON requests(project_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_ai_decision ON requests(ai_decision);
