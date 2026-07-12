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
  'in-scope': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'out-of-scope': 'bg-red-500/10 text-red-400 border-red-500/20',
  'needs-info': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const statusBorderColor: Record<string, string> = {
  'out-of-scope': '#f87171',
  'in-scope': '#34d399',
  'needs-info': '#fbbf24',
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
      const [reqs, projs] = await Promise.all([
        getRequests(undefined, userId),
        getProjects(userId)
      ]);
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
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Scope Requests</h1>
          <p className="text-white/60 font-medium">Loading...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-white/5 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-white/5 rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">Scope Requests</h1>
        <p className="text-white/60 font-medium">All client requests analyzed by ScopeOS AI</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full bg-white/[0.02] p-1 rounded-xl shadow-inner mb-6 border border-white/[0.06] overflow-x-auto scrollbar-none justify-start">
          <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:shadow-sm data-[state=active]:text-white font-semibold text-white/60 transition-all">All ({requests.length})</TabsTrigger>
          <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:shadow-sm data-[state=active]:text-white font-semibold text-white/60 transition-all">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="clarification" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:shadow-sm data-[state=active]:text-white font-semibold text-white/60 transition-all">Clarification ({clarificationCount})</TabsTrigger>
          <TabsTrigger value="decided" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:shadow-sm data-[state=active]:text-white font-semibold text-white/60 transition-all">Decided ({decidedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-14 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-white font-semibold mb-1">No requests here yet</p>
              <p className="text-white/60 text-sm">
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
                const borderColor = statusBorderColor[decision] || 'rgba(255,255,255,0.1)';
                return (
                  <Card
                    key={request.id}
                    className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 group cursor-pointer hover:bg-white/[0.04]"
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
                          <p className="font-semibold text-white group-hover:text-blue-400 text-base leading-snug transition-colors">{request.message}</p>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="text-xs font-semibold uppercase tracking-wider text-white/60 bg-white/[0.04] px-2 py-0.5 rounded-md">
                              {project ? project.name : 'Unknown project'}
                            </span>
                            <span className="text-xs text-white/40">•</span>
                            <span className="text-xs font-medium text-white/60">{request.client_id}</span>
                            <span className="text-xs text-white/40">•</span>
                            <span className="text-xs font-medium text-white/40">{formatDate(request.created_at)}</span>
                          </div>
                          {request.reasoning && (
                            <p className="text-sm text-white/60 mt-2 italic line-clamp-2 bg-white/[0.02] p-2 rounded-lg border border-white/[0.06]">"{request.reasoning}"</p>
                          )}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex md:flex-col gap-2 md:items-end items-center flex-wrap">
                        {decision ? (
                          <Badge className={`text-[10px] uppercase tracking-wider font-bold border px-2.5 py-0.5 rounded-full ${decisionColor[decision] || 'bg-white/[0.04] text-white/60 border-white/[0.06]'}`}>
                            {decisionLabel[decision] || decision}
                          </Badge>
                        ) : (
                          <Badge className="text-[10px] uppercase tracking-wider font-bold bg-white/[0.04] text-white/60 border border-white/[0.06] px-2.5 py-0.5 rounded-full">Pending</Badge>
                        )}
                        {request.estimated_impact && (
                          <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                            {request.estimated_impact}
                          </span>
                        )}
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
                          request.status === 'pending'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-white/[0.04] text-white/60 border-white/[0.06]'
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
