'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getProjects } from '@/lib/database';
import type { Project } from '@/lib/supabase';
import { Zap, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PortalPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Portal page - load all projects (no userId filter for public portal)
      const projs = await getProjects();
      setProjects(projs);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white">Submit Change Requests</h1>
          <p className="text-xl text-white/40">Loading projects...</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-card rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-white/[0.04] rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-white/[0.04] rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-white">Submit Change Requests</h1>
        <p className="text-xl text-white/40">Easily propose changes to your projects. Our AI analyzes scope automatically.</p>
      </div>

      {projects.length === 0 ? (
        <Card className="glass-card rounded-xl p-6 md:p-12 text-center">
          <p className="text-white/30 mb-4">No projects available</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id}
              className="glass-card rounded-xl p-6 hover:border-white/10 transition-all cursor-pointer border-l-4 border-l-blue-500 group glow-border-hover"
              onClick={() => router.push(`/portal/${project.id}`)}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{project.name}</h3>
                  <p className="text-sm text-white/40 mt-1">{project.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-white/30">{project.request_count} pending requests</span>
                    <span className="text-xs text-white/30">{project.task_count} total tasks</span>
                  </div>
                </div>
                <Zap className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="glass-card rounded-xl p-6 border-blue-500/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">How it works</h3>
            <ul className="text-sm text-white/40 space-y-1">
              <li>✓ Submit your change request with detailed description</li>
              <li>✓ ScopeOS analyzes if it&apos;s in or out of scope</li>
              <li>✓ Get immediate feedback or answer clarification questions</li>
              <li>✓ Project manager reviews the decision</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
