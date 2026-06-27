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
import { LayoutGrid, List, Search, Plus, Globe, FolderOpen } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProjectsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const userId = await getCurrentUserId();
      if (userId) { const projs = await getProjects(userId); setProjects(projs); }
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (!mounted) return null;

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.client_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'paused': return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'completed': return 'bg-blue-50 text-[#2563EB] border border-blue-200';
      default: return 'bg-slate-50 text-[#64748B] border border-slate-200';
    }
  };

  const ListViewCard = ({ project }: { project: Project }) => (
    <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between" onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
      <div className="flex items-center gap-5 flex-1 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <FolderOpen className="text-[#2563EB]" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-[#0D1526] truncate group-hover:text-[#2563EB] transition-colors">{project.name}</h3>
          <p className="text-sm font-medium text-[#64748B] mt-0.5 truncate">{project.client_name}</p>
        </div>
      </div>
      
      <div className="hidden md:flex flex-col mx-8 shrink-0">
        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-1">Activity</p>
        <div className="flex items-center gap-4">
          <div className="text-xs text-[#94A3B8]"><span className="font-bold text-[#0D1526]">{project.request_count}</span> reqs</div>
          <div className="text-xs text-[#94A3B8]"><span className="font-bold text-[#0D1526]">{project.task_count}</span> tasks</div>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="flex items-center gap-2">
          {project.portal_enabled && (
            <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
              <Globe className="w-3 h-3 mr-1 inline-block" /> Portal
            </Badge>
          )}
          <Badge className={`${getStatusColor(project.status)} text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full`}>{project.status}</Badge>
        </div>
      </div>
    </Card>
  );

  const GridViewCard = ({ project }: { project: Project }) => (
    <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer flex flex-col h-full group" onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
          <FolderOpen className="text-[#2563EB]" size={24} />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {project.portal_enabled && (
            <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full" title="Client Portal Enabled">
              <Globe className="w-3 h-3" />
            </Badge>
          )}
          <Badge className={`${getStatusColor(project.status)} text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full`}>{project.status}</Badge>
        </div>
      </div>
      
      <div className="flex-1 min-w-0 mb-5">
        <h3 className="text-lg font-bold text-[#0D1526] truncate group-hover:text-[#2563EB] transition-colors">{project.name}</h3>
        <p className="text-sm font-medium text-[#64748B] mt-1">{project.client_name}</p>
        {project.description && <p className="text-sm text-[#94A3B8] mt-3 line-clamp-2">{project.description}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#E2E8F4]">
        <div className="flex flex-col">
          <span className="text-xl font-black text-[#0D1526]">{project.request_count}</span>
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Requests</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-[#0D1526]">{project.task_count}</span>
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Tasks</span>
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
        <div><h1 className="text-2xl font-bold text-[#0D1526] mb-1 tracking-tight">Projects</h1><p className="text-[#64748B] font-medium">Loading...</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (<Card key={i} className="bg-white border border-[#E2E8F4] rounded-2xl p-6 shadow-sm animate-pulse"><div className="h-12 w-12 bg-slate-100 rounded-xl mb-4"></div><div className="h-5 bg-slate-100 rounded w-1/3 mb-3"></div><div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div><div className="h-2 bg-slate-100 rounded w-full"></div></Card>))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1526] mb-1 tracking-tight">Projects</h1>
          <p className="text-[#64748B] font-medium">Manage all your agency projects</p>
        </div>
        <Button onClick={() => router.push('/dashboard/projects/new')} className="bg-[#2563EB] hover:bg-[#1A56DB] text-white border-0 rounded-full shadow-sm shadow-blue-500/20 px-6 font-semibold"><Plus className="w-4 h-4 mr-2" />New Project</Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-4 xl:items-center">
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <Input placeholder="Search projects by name or client..." className="pl-10 h-11 bg-white border-[#E2E8F4] focus:border-[#2563EB] rounded-xl shadow-sm text-sm transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="hidden sm:block">
            <TabsList className="bg-slate-100/50 p-1 border border-slate-200 rounded-xl shadow-inner">
              <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2563EB] font-semibold text-[#64748B]">All</TabsTrigger>
              <TabsTrigger value="active" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2563EB] font-semibold text-[#64748B]">Active</TabsTrigger>
              <TabsTrigger value="paused" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2563EB] font-semibold text-[#64748B]">Paused</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2563EB] font-semibold text-[#64748B]">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center bg-slate-100/50 border border-slate-200 rounded-xl p-1 shadow-inner h-10">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-[#94A3B8] hover:text-[#0D1526]'}`} title="Grid View"><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#2563EB]' : 'text-[#94A3B8] hover:text-[#0D1526]'}`} title="List View"><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-16 text-center shadow-sm max-w-2xl mx-auto mt-8">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-6 h-6 text-[#94A3B8]" />
          </div>
          <h3 className="text-lg font-bold text-[#0D1526] mb-1">No projects found</h3>
          <p className="text-[#64748B] mb-6">Create a project to start managing client scope requests.</p>
          <Button onClick={() => router.push('/dashboard/projects/new')} className="bg-[#2563EB] hover:bg-[#1A56DB] text-white border-0 rounded-full font-semibold px-8 shadow-sm">Create First Project</Button>
        </Card>
      ) : (
        <div className={viewMode === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'}>
          {filteredProjects.map((project) => (
            <div key={project.id}>{viewMode === 'list' ? <ListViewCard project={project} /> : <GridViewCard project={project} />}</div>
          ))}
        </div>
      )}
    </div>
  );
}
