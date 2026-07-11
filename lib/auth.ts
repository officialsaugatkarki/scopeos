import { supabase } from './supabase';
import type { Profile } from './supabase';

export interface User {
  id: string;
  email: string;
  name: string;
  agencyName?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// ============================================================
// Supabase Auth Functions
// ============================================================

export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // Upsert the profile row.
      // The DB trigger (handle_new_user / SECURITY DEFINER) fires first and
      // creates the row. This upsert merges any client-supplied fields on top.
      // NOTE: do NOT chain .select().single() here — if the trigger already
      // created the row and nothing changed, PostgREST returns 0 rows and
      // .single() would throw a PGRST116 error.
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: data.user.id,
            email: data.user.email || email,
            name: name,
            agency_name: '',
            role: 'Agency Owner',
            team_size: '1',
            avatar_url: '',
            website: '',
            default_hourly_rate: 0,
            currency: 'USD',
            timezone: 'UTC',
            date_format: 'MM/DD/YYYY',
            language: 'en',
            onboarding_completed: false,
            current_plan: 'free',
            subscription_status: 'active',
            is_on_trial: true,
            trial_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          },
          { onConflict: 'id' }   // merge on conflict (no ignoreDuplicates)
        );

      if (profileError) {
        // Non-fatal: auth succeeded, profile can be backfilled on next login
        console.error('Profile upsert error (non-fatal):', profileError);
      }

      return {
        user: {
          id: data.user.id,
          email: data.user.email || email,
          name: name,
        },
        error: null,
      };
    }

    return { user: null, error: 'Signup failed' };
  } catch (err) {
    return { user: null, error: err instanceof Error ? err.message : 'An error occurred' };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, error: error.message };
  }

  if (data.user) {
    // Fetch profile for full user data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      user: {
        id: data.user.id,
        email: data.user.email || email,
        name: profile?.name || data.user.user_metadata?.name || '',
        agencyName: profile?.agency_name || '',
        role: profile?.role || '',
      },
      error: null,
    };
  }

  return { user: null, error: 'Login failed' };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<AuthState> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return { user: null, isAuthenticated: false };
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return {
    user: {
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.name || session.user.user_metadata?.name || '',
      agencyName: profile?.agency_name || '',
      role: profile?.role || '',
    },
    isAuthenticated: true,
  };
}

export async function getCurrentUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
}

export async function getProfile(): Promise<Profile | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function isOnboardingCompleted(): Promise<boolean> {
  const profile = await getProfile();
  return profile?.onboarding_completed || false;
}

// ============================================================
// Validation helpers (kept from original)
// ============================================================

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================
// Legacy compatibility shim (for components not yet migrated)
// These use the async session under the hood
// ============================================================

let _cachedAuth: AuthState = { user: null, isAuthenticated: false };

export function getAuthData(): AuthState {
  // Return cached data synchronously (updated by initAuth)
  return _cachedAuth;
}

export function setAuthData(user: User) {
  _cachedAuth = { user, isAuthenticated: true };
}

export function clearAuthData() {
  _cachedAuth = { user: null, isAuthenticated: false };
}

export async function initAuth(): Promise<AuthState> {
  const state = await getSession();
  _cachedAuth = state;
  return state;
}
