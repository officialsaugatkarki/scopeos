'use client';

import { useState, useEffect } from 'react';
import { ScopeDocumentView } from '@/components/scope-document-view';
import { getScopeDocument, getProjects } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';
import type { ScopeDocument, ScopeDocumentSection } from '@/lib/supabase';

export default function ScopeDocumentDemo() {
  const [document, setDocument] = useState<(ScopeDocument & { sections: ScopeDocumentSection[] }) | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const userId = await getCurrentUserId();
      if (userId) {
        const projects = await getProjects(userId);
        if (projects.length > 0) {
          const doc = await getScopeDocument(projects[0].id);
          setDocument(doc);
          setProjectName(projects[0].name);
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) return null;

  if (!document) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Scope document not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Scope Document Demo</h1>
        <p className="text-muted-foreground">View and manage project scope documents</p>
      </div>

      <ScopeDocumentView document={document} projectName={projectName} />
    </div>
  );
}
