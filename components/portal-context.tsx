'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProjectByToken, getScopeRequests, getChangeRequests, getPortalMessages } from '@/lib/database';
import type { Project, ScopeRequest, ChangeRequest, PortalMessage } from '@/lib/supabase';

interface PortalContextType {
  project: Project | null;
  token: string;
  isLoading: boolean;
  error: string | null;
  requests: ScopeRequest[];
  changeRequests: ChangeRequest[];
  messages: PortalMessage[];
  refreshRequests: () => Promise<void>;
  refreshChangeRequests: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const PortalContext = createContext<PortalContextType | null>(null);

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used within PortalProvider');
  return ctx;
}

interface PortalProviderProps {
  token: string;
  children: React.ReactNode;
}

export function PortalProvider({ token, children }: PortalProviderProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<ScopeRequest[]>([]);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [messages, setMessages] = useState<PortalMessage[]>([]);

  const loadProject = useCallback(async () => {
    try {
      const proj = await getProjectByToken(token);
      if (!proj) {
        setError('Portal not found or has been disabled.');
        setIsLoading(false);
        return;
      }
      setProject(proj);

      // Load all related data in parallel
      const [reqs, crs, msgs] = await Promise.all([
        getScopeRequests(proj.id),
        getChangeRequests(proj.id),
        getPortalMessages(proj.id),
      ]);
      setRequests(reqs);
      setChangeRequests(crs);
      setMessages(msgs);
    } catch (e) {
      console.error('Portal load error:', e);
      setError('Failed to load portal data.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  const refreshRequests = useCallback(async () => {
    if (!project) return;
    const reqs = await getScopeRequests(project.id);
    setRequests(reqs);
  }, [project]);

  const refreshChangeRequests = useCallback(async () => {
    if (!project) return;
    const crs = await getChangeRequests(project.id);
    setChangeRequests(crs);
  }, [project]);

  const refreshMessages = useCallback(async () => {
    if (!project) return;
    const msgs = await getPortalMessages(project.id);
    setMessages(msgs);
  }, [project]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshRequests(), refreshChangeRequests(), refreshMessages()]);
  }, [refreshRequests, refreshChangeRequests, refreshMessages]);

  return (
    <PortalContext.Provider value={{
      project,
      token,
      isLoading,
      error,
      requests,
      changeRequests,
      messages,
      refreshRequests,
      refreshChangeRequests,
      refreshMessages,
      refreshAll,
    }}>
      {children}
    </PortalContext.Provider>
  );
}
