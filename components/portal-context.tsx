'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getProjectByToken, getRequests, getPortalMessages } from '@/lib/database';
import type { Project, Request, PortalMessage } from '@/lib/supabase';

interface PortalContextType {
  project: Project | null;
  token: string;
  isLoading: boolean;
  error: string | null;
  requests: Request[];
  messages: PortalMessage[];
  refreshRequests: () => Promise<void>;
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
  const [requests, setRequests] = useState<Request[]>([]);
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
      const [reqs, msgs] = await Promise.all([
        getRequests(proj.id),
        getPortalMessages(proj.id),
      ]);
      setRequests(reqs);
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
    const reqs = await getRequests(project.id);
    setRequests(reqs);
  }, [project]);

  const refreshMessages = useCallback(async () => {
    if (!project) return;
    const msgs = await getPortalMessages(project.id);
    setMessages(msgs);
  }, [project]);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshRequests(), refreshMessages()]);
  }, [refreshRequests, refreshMessages]);

  return (
    <PortalContext.Provider value={{
      project,
      token,
      isLoading,
      error,
      requests,
      messages,
      refreshRequests,
      refreshMessages,
      refreshAll,
    }}>
      {children}
    </PortalContext.Provider>
  );
}
