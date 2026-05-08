'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getProjects } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';
import type { Project } from '@/lib/supabase';

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const userId = await getCurrentUserId();
      if (userId) { const data = await getProjects(userId); setProjects(data); }
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Your Projects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="glass-card rounded-xl p-6 animate-pulse">
              <div className="h-10 w-10 bg-white/[0.04] rounded-lg mb-4"></div>
              <div className="h-4 bg-white/[0.04] rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-white/[0.04] rounded w-full mb-4"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Your Projects</h2>
        <Link href="/dashboard/projects/new">
          <Button className="btn-gradient text-white border-0 flex items-center gap-2 h-9 rounded-xl">
            <Plus size={18} /> New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="glass-card rounded-xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 mb-4">No projects yet</p>
          <Link href="/dashboard/projects/new">
            <Button className="btn-gradient text-white border-0 rounded-xl">Create Your First Project</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="glass-card rounded-xl hover:border-white/10 transition-all cursor-pointer glow-border-hover group">
              <Link href={`/dashboard/projects/${project.id}`}>
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <FolderOpen className="text-blue-400" size={20} />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : project.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-white mb-2">{project.name}</h3>
                  <p className="text-sm text-white/40 mb-4 flex-1">{project.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <div className="text-xs text-white/30">
                      <span className="font-semibold text-white/60">{project.request_count}</span> requests
                    </div>
                    <div className="text-xs text-white/30">
                      <span className="font-semibold text-white/60">{project.task_count}</span> tasks
                    </div>
                    <ArrowRight size={16} className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
