'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FolderOpen, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getProjects } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';
import type { Project } from '@/lib/supabase';

const statusColors = {
  active: 'border-green-500/20 bg-green-500/5',
  completed: 'border-blue-500/20 bg-blue-500/5',
  paused: 'border-yellow-500/20 bg-yellow-500/5',
};

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const userId = await getCurrentUserId();
      if (userId) {
        const data = await getProjects(userId);
        setProjects(data);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Your Projects</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-10 w-10 bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-4"></div>
              <div className="h-8 bg-muted rounded w-full"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Your Projects</h2>
        <Link href="/dashboard/projects/new">
          <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 h-9">
            <Plus size={18} />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No projects yet</p>
          <Link href="/dashboard/projects/new">
            <Button>Create Your First Project</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className={`backdrop-blur-sm border-accent/20 hover:border-accent/40 transition-all cursor-pointer ${
                statusColors[project.status] || ''
              }`}
            >
              <Link href={`/dashboard/projects/${project.id}`}>
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FolderOpen className="text-primary" size={20} />
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        project.status === 'active'
                          ? 'bg-green-500/20 text-green-700'
                          : project.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-700'
                            : 'bg-yellow-500/20 text-yellow-700'
                      }`}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground mb-2">{project.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{project.request_count}</span> requests
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{project.task_count}</span> tasks
                    </div>
                    <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100" />
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
