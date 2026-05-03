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
          <h1 className="text-4xl font-bold text-foreground">Submit Change Requests</h1>
          <p className="text-xl text-muted-foreground">Loading projects...</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Submit Change Requests</h1>
        <p className="text-xl text-muted-foreground">
          Easily propose changes to your projects. Our AI analyzes scope automatically.
        </p>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No projects available</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-primary group"
              onClick={() => router.push(`/portal/${project.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-muted-foreground">
                      {project.request_count} pending requests
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {project.task_count} total tasks
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Zap className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">How it works</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Submit your change request with detailed description</li>
              <li>✓ ScopeGuard AI analyzes if it's in or out of scope</li>
              <li>✓ Get immediate feedback or answer clarification questions</li>
              <li>✓ Project manager reviews the decision</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
