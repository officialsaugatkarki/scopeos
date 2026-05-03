'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { getProjects } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';
import type { Project } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LayoutGrid, List, Search, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProjectsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const userId = await getCurrentUserId();
      if (userId) {
        const projs = await getProjects(userId);
        setProjects(projs);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (!mounted) return null;

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'paused':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBudgetUsage = (project: Project) => {
    if (!project.budget || project.budget === 0) return 0;
    return Math.round((project.spent / project.budget) * 100);
  };

  const ListViewCard = ({ project }: { project: Project }) => (
    <Card
      className="p-6 hover:shadow-md transition-all cursor-pointer"
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {project.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Client: {project.client_name}
          </p>
        </div>
        <Badge className={getStatusColor(project.status)}>
          {project.status}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {project.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Requests</p>
          <p className="text-lg font-semibold">{project.request_count}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Tasks</p>
          <p className="text-lg font-semibold">{project.task_count}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-muted-foreground">Budget Usage</p>
          <p className="text-xs font-medium">${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}</p>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${getBudgetUsage(project)}%` }}
          />
        </div>
      </div>
    </Card>
  );

  const GridViewCard = ({ project }: { project: Project }) => (
    <Card
      className="p-6 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
      onClick={() => router.push(`/dashboard/projects/${project.id}`)}
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-foreground truncate">
            {project.name}
          </h3>
        </div>
        <Badge className={`${getStatusColor(project.status)} text-xs whitespace-nowrap`}>
          {project.status}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {project.client_name}
      </p>

      <div className="space-y-3 mb-4 flex-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Requests</span>
          <span className="font-semibold">{project.request_count}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Tasks</span>
          <span className="font-semibold">{project.task_count}</span>
        </div>
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-muted-foreground">Budget</span>
            <span className="font-semibold">{getBudgetUsage(project)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${getBudgetUsage(project)}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-5 bg-muted rounded w-1/3 mb-3"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-2 bg-muted rounded w-full"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Manage all your agency projects and track scope creep
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/projects/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="paused">Paused</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No projects found</p>
          <Button onClick={() => router.push('/dashboard/projects/new')}>
            Create Your First Project
          </Button>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'list'
              ? 'space-y-4'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          }
        >
          {filteredProjects.map((project) => (
            <div key={project.id}>
              {viewMode === 'list' ? (
                <ListViewCard project={project} />
              ) : (
                <GridViewCard project={project} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
