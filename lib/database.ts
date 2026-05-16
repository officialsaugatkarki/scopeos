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
  PortalMessage,
  PortalFile,
  DirectMessage,
  AgencyPricing,
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
  project: {
    user_id: string;
    name: string;
    client_name: string;
    client_email: string;
    portal_enabled?: boolean;
    description?: string;
  }
): Promise<Project | null> {
  const portalToken = crypto.randomUUID();

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: project.user_id,
      name: project.name,
      description: project.description || '',
      client_name: project.client_name,
      client_email: project.client_email,
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      budget: 0,
      spent: 0,
      scope_baseline: '',
      portal_token: portalToken,
      portal_enabled: project.portal_enabled ?? true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }
  return data;
}

export async function getProjectByToken(token: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('portal_token', token)
    .eq('portal_enabled', true)
    .single();

  if (error) {
    console.error('Error fetching project by token:', error);
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

// ============================================================
// PORTAL MESSAGES
// ============================================================

export async function getPortalMessages(
  projectId: string,
  limit: number = 50
): Promise<PortalMessage[]> {
  const { data, error } = await supabase
    .from('portal_messages')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching portal messages:', error);
    return [];
  }
  return data || [];
}

export async function createPortalMessage(
  message: Pick<PortalMessage, 'project_id' | 'role' | 'content'> & {
    metadata?: PortalMessage['metadata'];
  }
): Promise<PortalMessage | null> {
  const { data, error } = await supabase
    .from('portal_messages')
    .insert({
      project_id: message.project_id,
      role: message.role,
      content: message.content,
      metadata: message.metadata || {},
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating portal message:', error);
    return null;
  }
  return data;
}

// ============================================================
// AGENCY PRICING
// ============================================================

export async function getAgencyPricing(userId: string): Promise<AgencyPricing | null> {
  const { data, error } = await supabase
    .from('agency_pricing')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    // No pricing set yet is normal
    return null;
  }
  return data;
}

export async function upsertAgencyPricing(
  userId: string,
  pricing: Partial<Omit<AgencyPricing, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<AgencyPricing | null> {
  const { data, error } = await supabase
    .from('agency_pricing')
    .upsert(
      {
        user_id: userId,
        ...pricing,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting agency pricing:', error);
    return null;
  }
  return data;
}

// ============================================================
// PORTAL FILES
// ============================================================

export async function getPortalFiles(projectId: string): Promise<PortalFile[]> {
  const { data, error } = await supabase
    .from('portal_files')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching portal files:', error);
    return [];
  }
  return data || [];
}

export async function createPortalFile(
  file: Pick<PortalFile, 'project_id' | 'file_name' | 'file_type' | 'file_size' | 'storage_path' | 'uploaded_by'>
): Promise<PortalFile | null> {
  const { data, error } = await supabase
    .from('portal_files')
    .insert(file)
    .select()
    .single();

  if (error) {
    console.error('Error creating portal file record:', error);
    return null;
  }
  return data;
}

export async function deletePortalFile(id: string): Promise<boolean> {
  // Get the file record first to delete from storage
  const { data: file } = await supabase
    .from('portal_files')
    .select('storage_path')
    .eq('id', id)
    .single();

  if (file?.storage_path) {
    await supabase.storage
      .from('portal-files')
      .remove([file.storage_path]);
  }

  const { error } = await supabase
    .from('portal_files')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting portal file:', error);
    return false;
  }
  return true;
}

export async function uploadPortalFile(
  projectId: string,
  file: File
): Promise<PortalFile | null> {
  const storagePath = `${projectId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('portal-files')
    .upload(storagePath, file);

  if (uploadError) {
    console.error('Error uploading file to storage:', uploadError);
    return null;
  }

  return createPortalFile({
    project_id: projectId,
    file_name: file.name,
    file_type: file.type || null,
    file_size: file.size,
    storage_path: storagePath,
    uploaded_by: 'client',
  });
}

export function getPortalFileUrl(storagePath: string): string {
  const { data } = supabase.storage
    .from('portal-files')
    .getPublicUrl(storagePath);
  return data.publicUrl;
}

// ============================================================
// DIRECT MESSAGES (PM ↔ Client)
// ============================================================

export async function getDirectMessages(projectId: string): Promise<DirectMessage[]> {
  const { data, error } = await supabase
    .from('direct_messages')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching direct messages:', error);
    return [];
  }
  return data || [];
}

export async function sendDirectMessage(
  msg: Pick<DirectMessage, 'project_id' | 'sender_role' | 'sender_name' | 'content'>
): Promise<DirectMessage | null> {
  const { data, error } = await supabase
    .from('direct_messages')
    .insert(msg)
    .select()
    .single();

  if (error) {
    console.error('Error sending direct message:', error);
    return null;
  }
  return data;
}

export async function markDirectMessagesRead(
  projectId: string,
  role: 'client' | 'pm'
): Promise<void> {
  // Mark messages as read that were sent by the OTHER role
  const otherRole = role === 'client' ? 'pm' : 'client';
  await supabase
    .from('direct_messages')
    .update({ read: true })
    .eq('project_id', projectId)
    .eq('sender_role', otherRole)
    .eq('read', false);
}

export async function getUnreadMessageCount(
  projectId: string,
  forRole: 'client' | 'pm'
): Promise<number> {
  const otherRole = forRole === 'client' ? 'pm' : 'client';
  const { count, error } = await supabase
    .from('direct_messages')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId)
    .eq('sender_role', otherRole)
    .eq('read', false);

  if (error) return 0;
  return count || 0;
}

