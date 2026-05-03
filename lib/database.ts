import { supabase } from './supabase';
import type {
  Profile,
  Project,
  ScopeDocument,
  ScopeDocumentSection,
  ScopeRequest,
  ScopeRequestHistory,
  ChangeRequest,
  Integration,
  UserSettings,
} from './supabase';

// ============================================================
// PROFILES
// ============================================================

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  return data;
}

// ============================================================
// PROJECTS
// ============================================================

export async function getProjects(userId?: string): Promise<Project[]> {
  let query = supabase.from('projects').select('*').order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('user_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return data || [];
}

export async function getProject(id: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }
  return data;
}

export async function createProject(
  project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'request_count' | 'task_count' | 'scope_analytics' | 'portal_url'>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  return data;
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }
  return data;
}

export async function deleteProject(id: string): Promise<boolean> {
  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  return true;
}

// ============================================================
// SCOPE DOCUMENTS
// ============================================================

export async function getScopeDocument(
  projectId: string
): Promise<(ScopeDocument & { sections: ScopeDocumentSection[] }) | null> {
  const { data: doc, error: docError } = await supabase
    .from('scope_documents')
    .select('*')
    .eq('project_id', projectId)
    .single();

  if (docError || !doc) {
    return null;
  }

  const { data: sections, error: secError } = await supabase
    .from('scope_document_sections')
    .select('*')
    .eq('document_id', doc.id)
    .order('sort_order', { ascending: true });

  return {
    ...doc,
    sections: sections || [],
  };
}

// ============================================================
// SCOPE REQUESTS
// ============================================================

export async function getScopeRequests(projectId?: string): Promise<ScopeRequest[]> {
  let query = supabase
    .from('scope_requests')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching scope requests:', error);
    return [];
  }
  return data || [];
}

export async function getScopeRequest(
  id: string
): Promise<(ScopeRequest & { history: ScopeRequestHistory[] }) | null> {
  const { data: request, error: reqError } = await supabase
    .from('scope_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (reqError || !request) {
    console.error('Error fetching scope request:', reqError);
    return null;
  }

  const { data: history } = await supabase
    .from('scope_request_history')
    .select('*')
    .eq('request_id', id)
    .order('created_at', { ascending: true });

  return {
    ...request,
    history: history || [],
  };
}

export async function createScopeRequest(
  request: Pick<ScopeRequest, 'project_id' | 'client_name' | 'client_email' | 'title' | 'description'> & {
    client_id?: string;
    attachments?: string[];
  }
): Promise<ScopeRequest | null> {
  const { data, error } = await supabase
    .from('scope_requests')
    .insert({
      ...request,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating scope request:', error);
    return null;
  }

  // Add history entry
  if (data) {
    await supabase.from('scope_request_history').insert({
      request_id: data.id,
      action: 'submitted',
      actor: 'Client',
      details: '',
    });
  }

  return data;
}

export async function updateScopeRequest(
  id: string,
  updates: Partial<ScopeRequest>
): Promise<ScopeRequest | null> {
  const { data, error } = await supabase
    .from('scope_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating scope request:', error);
    return null;
  }
  return data;
}

// ============================================================
// CHANGE REQUESTS
// ============================================================

export async function getChangeRequests(projectId?: string): Promise<ChangeRequest[]> {
  let query = supabase
    .from('change_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (projectId) {
    query = query.eq('project_id', projectId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching change requests:', error);
    return [];
  }
  return data || [];
}

export async function createChangeRequest(
  request: Omit<ChangeRequest, 'id' | 'created_at' | 'updated_at'>
): Promise<ChangeRequest | null> {
  const { data, error } = await supabase
    .from('change_requests')
    .insert(request)
    .select()
    .single();

  if (error) {
    console.error('Error creating change request:', error);
    return null;
  }
  return data;
}

export async function updateChangeRequest(
  id: string,
  updates: Partial<ChangeRequest>
): Promise<ChangeRequest | null> {
  const { data, error } = await supabase
    .from('change_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating change request:', error);
    return null;
  }
  return data;
}

// ============================================================
// INTEGRATIONS
// ============================================================

export async function getIntegrations(userId: string): Promise<Integration[]> {
  const { data, error } = await supabase
    .from('integrations')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching integrations:', error);
    return [];
  }
  return data || [];
}

export async function getIntegration(id: string): Promise<Integration | null> {
  const { data, error } = await supabase
    .from('integrations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching integration:', error);
    return null;
  }
  return data;
}

export async function updateIntegration(
  id: string,
  updates: Partial<Integration>
): Promise<Integration | null> {
  const { data, error } = await supabase
    .from('integrations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating integration:', error);
    return null;
  }
  return data;
}

// ============================================================
// USER SETTINGS
// ============================================================

export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user settings:', error);
    return null;
  }
  return data;
}

export async function updateUserSettings(
  userId: string,
  updates: Partial<UserSettings>
): Promise<UserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user settings:', error);
    return null;
  }
  return data;
}
