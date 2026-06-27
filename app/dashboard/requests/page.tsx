'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getRequests, getProjects } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';
import type { Request, Project } from '@/lib/supabase';
import { Clock, CheckCircle2, AlertCircle, HelpCircle, TrendingUp } from 'lucide-react';

const decisionLabel: Record<string, string> = {
  'in-scope': 'In Scope',
  'out-of-scope': 'Out of Scope',
  'needs-info': 'Needs Info',
};

const decisionColor: Record<string, string> = {
  'in-scope': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  'out-of-scope': 'bg-red-50 text-red-600 border-red-200',
  'needs-info': 'bg-amber-50 text-amber-600 border-amber-200',
};

const statusBorderColor: Record<string, string> = {
  'out-of-scope': '#ef4444',
  'in-scope': '#10b981',
  'needs-info': '#f59e0b',
};

export default function RequestsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState<Request[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setMounted(true);
      const userId = await getCurrentUserId();
      if (!userId) return;
      const [reqs, projs] = await Promise.all([getRequests(), getProjects(userId)]);
      setRequests(reqs);
      setProjects(projs);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (!mounted) return null;

  const pendingCount = requests.filter(r => ['pending', 'analyzed'].includes(r.status)).length;
  const clarificationCount = requests.filter(r => r.ai_decision === 'needs-info').length;
  const decidedCount = requests.filter(r => ['in-scope', 'out-of-scope'].includes(r.ai_decision)).length;

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return ['pending', 'analyzed'].includes(req.status);
    if (activeTab === 'clarification') return req.ai_decision === 'needs-info';
    if (activeTab === 'decided') return ['in-scope', 'out-of-scope'].includes(req.ai_decision);
    return true;
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1526] mb-2 tracking-tight">Scope Requests</h1>
          <p className="text-[#64748B] font-medium">Loading...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-white border border-[#E2E8F4] rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#0D1526] mb-1 tracking-tight">Scope Requests</h1>
        <p className="text-[#64748B] font-medium">All client requests analyzed by ScopeOS AI</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100/50 p-1 rounded-xl shadow-inner mb-6 border border-slate-200">
          <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2563EB] font-semibold text-[#64748B]">All ({requests.length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2563EB] font-semibold text-[#64748B]">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="clarification" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2563EB] font-semibold text-[#64748B]">Clarification ({clarificationCount})</TabsTrigger>
          <TabsTrigger value="decided" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#2563EB] font-semibold text-[#64748B]">Decided ({decidedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-14 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-[#2563EB]" />
              </div>
              <p className="text-[#0D1526] font-semibold mb-1">No requests here yet</p>
              <p className="text-[#64748B] text-sm">
                {activeTab === 'all'
                  ? 'Requests will appear once clients message through the portal'
                  : 'No requests match this filter'}
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredRequests.map(request => {
                const project = projects.find(p => p.id === request.project_id);
                const decision = request.ai_decision;
                const borderColor = statusBorderColor[decision] || '#E2E8F4';
                return (
                  <Card
                    key={request.id}
                    className="bg-white border border-[#E2E8F4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 group cursor-pointer hover:border-r-blue-200 hover:border-y-blue-200"
                    style={{ borderLeftColor: borderColor }}
                    onClick={() => window.location.href = `/dashboard/requests/${request.id}`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                      {/* Message */}
                      <div className="md:col-span-2 flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {decision === 'needs-info'
                            ? <HelpCircle className="w-5 h-5 text-amber-500" />
                            : decision === 'out-of-scope'
                            ? <AlertCircle className="w-5 h-5 text-red-500" />
                            : decision === 'in-scope'
                            ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            : <Clock className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#0D1526] group-hover:text-[#2563EB] text-base leading-snug transition-colors">{request.message}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B] bg-slate-100 px-2 py-0.5 rounded-md">
                              {project ? project.name : 'Unknown project'}
                            </span>
                            <span className="text-xs text-[#94A3B8]">•</span>
                            <span className="text-xs font-medium text-[#64748B]">{request.client_id}</span>
                            <span className="text-xs text-[#94A3B8]">•</span>
                            <span className="text-xs font-medium text-[#94A3B8]">{formatDate(request.created_at)}</span>
                          </div>
                          {request.reasoning && (
                            <p className="text-sm text-[#64748B] mt-2 italic line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">"{request.reasoning}"</p>
                          )}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex md:flex-col gap-2 md:items-end items-center flex-wrap">
                        {decision ? (
                          <Badge className={`text-[10px] uppercase tracking-wider font-bold border px-2.5 py-0.5 rounded-full ${decisionColor[decision] || 'bg-slate-100 text-[#64748B] border-slate-200'}`}>
                            {decisionLabel[decision] || decision}
                          </Badge>
                        ) : (
                          <Badge className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-[#64748B] border border-slate-200 px-2.5 py-0.5 rounded-full">Pending</Badge>
                        )}
                        {request.estimated_impact && (
                          <span className="text-xs font-semibold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                            {request.estimated_impact}
                          </span>
                        )}
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
                          request.status === 'pending'
                            ? 'bg-blue-50 text-[#2563EB] border-blue-200'
                            : 'bg-slate-100 text-[#64748B] border-slate-200'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
