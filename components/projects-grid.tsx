'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, ArrowRight, Plus, Globe } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getProjects, getRequests } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';
import type { Project, Request } from '@/lib/supabase';

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const userId = await getCurrentUserId();
      if (userId) { 
        const [projData, reqData] = await Promise.all([
          getProjects(userId),
          getRequests()
        ]);
        setProjects(projData);
        setRequests(reqData);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-white border border-[#E2E8F4] rounded-2xl p-6 animate-pulse shadow-sm">
            <div className="h-10 w-10 bg-slate-100 rounded-xl mb-4"></div>
            <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded w-full mb-4"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        {/* Intentionally left empty as the parent page provides the header */}
        <div></div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-[#2563EB] hover:bg-[#1A56DB] text-white border-0 flex items-center gap-2 h-9 rounded-full shadow-sm shadow-blue-500/20 px-4 text-xs font-semibold transition-all">
            <Plus size={16} /> New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-6 h-6 text-[#94A3B8]" />
          </div>
          <p className="text-[#64748B] font-medium mb-5">No projects yet</p>
          <Link href="/dashboard/projects/new">
            <Button className="bg-[#2563EB] hover:bg-[#1A56DB] text-white border-0 rounded-full shadow-sm font-semibold px-6">
              Create First Project
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map((project) => {
            const projectRequests = requests.filter(r => r.project_id === project.id);
            const totalRequests = projectRequests.length;
            const changeRequests = projectRequests.filter(r => r.ai_decision === 'out-of-scope').length;
            const pendingApprovals = projectRequests.filter(r => r.status === 'pending' || r.status === 'analyzed').length;

            return (
            <Card key={project.id} className="bg-white border border-[#E2E8F4] rounded-2xl hover:border-blue-200 transition-all cursor-pointer hover:shadow-md group flex flex-col h-full overflow-hidden">
              <Link href={`/dashboard/projects/${project.id}`} className="flex flex-col h-full">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <FolderOpen className="text-[#2563EB]" size={20} />
                    </div>
                    <div className="flex items-center gap-2">
                      {project.portal_enabled && (
                        <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                          <Globe className="w-3 h-3 mr-1 inline-block" /> Portal
                        </Badge>
                      )}
                      <Badge className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                        project.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : project.status === 'completed' ? 'bg-blue-50 text-[#2563EB] border border-blue-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-bold text-[#0D1526] text-lg mb-1 group-hover:text-[#2563EB] transition-colors">{project.name}</h3>
                  <p className="text-sm font-medium text-[#64748B] mb-6 flex-1">{project.client_name}</p>

                  <div className="grid grid-cols-3 gap-2 pt-5 border-t border-[#E2E8F4]">
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-[#0D1526]">{totalRequests}</span>
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Reqs</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-[#2563EB]">{changeRequests}</span>
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Changes</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-black text-amber-500">{pendingApprovals}</span>
                      <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Pending</span>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          )})}
        </div>
      )}
    </div>
  );
}
