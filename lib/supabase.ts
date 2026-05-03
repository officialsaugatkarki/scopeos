import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// Type definitions matching the database schema
// ============================================================

export interface Profile {
  id: string;
  email: string;
  name: string;
  agency_name: string;
  role: string;
  team_size: string;
  avatar_url: string;
  website: string;
  default_hourly_rate: number;
  currency: string;
  timezone: string;
  date_format: string;
  language: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  client_name: string;
  client_email: string;
  request_count: number;
  task_count: number;
  status: 'active' | 'completed' | 'paused';
  start_date: string;
  end_date: string | null;
  budget: number;
  spent: number;
  scope_baseline: string;
  portal_url: string;
  scope_analytics: {
    totalRequests: number;
    inScope: number;
    outOfScope: number;
    needsInfo: number;
  };
  created_at: string;
  updated_at: string;
}

export interface ScopeDocument {
  id: string;
  project_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  sections?: ScopeDocumentSection[];
}

export interface ScopeDocumentSection {
  id: string;
  document_id: string;
  section_number: string;
  title: string;
  content: string;
  sort_order: number;
  created_at: string;
}

export interface AIAnalysis {
  decision: 'in-scope' | 'out-of-scope' | 'needs-info';
  confidence: number;
  reasoning: string[];
  suggestedTasks?: string[];
  clarificationQuestions?: Array<{ question: string; context: string }>;
  estimatedHours?: string;
  acceptanceCriteria?: string[];
  baselineReference?: {
    section: string;
    text: string;
    note?: string;
  };
  costImpact?: string;
  suggestedAction: 'CREATE_TASK' | 'GENERATE_CHANGE_REQUEST' | 'ASK_QUESTIONS';
  changeRequestDraft?: {
    title: string;
    summary: string;
    impactAnalysis: string;
    acceptanceCriteria: string[];
  };
}

export interface ScopeRequest {
  id: string;
  project_id: string;
  client_id: string;
  client_name: string;
  client_email: string;
  title: string;
  description: string;
  attachments: string[];
  status: 'submitted' | 'reviewing' | 'clarification' | 'decision' | 'completed';
  ai_analysis: AIAnalysis | null;
  pm_notes: string;
  created_draft_at: string | null;
  completed_at: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  history?: ScopeRequestHistory[];
}

export interface ScopeRequestHistory {
  id: string;
  request_id: string;
  action: string;
  actor: string;
  details: string;
  created_at: string;
}

export interface ChangeRequest {
  id: string;
  project_id: string;
  client: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'in-review';
  estimated_hours: number;
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'coming-soon';
  category: 'project-management' | 'documentation' | 'communication' | 'analytics';
  connected_at: string | null;
  settings: Record<string, string>;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  notify_new_request: boolean;
  notify_clarification: boolean;
  notify_out_of_scope: boolean;
  notify_approved: boolean;
  notify_weekly_summary: boolean;
  notify_mentions: boolean;
  desktop_notifications: boolean;
  sound_alerts: boolean;
  confidence_threshold: number;
  scope_sensitivity: 'Low' | 'Medium' | 'High';
  email_from_name: string;
  email_reply_to: string;
  email_signature: string;
  created_at: string;
  updated_at: string;
}
