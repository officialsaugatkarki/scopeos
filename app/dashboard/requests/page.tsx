'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getScopeRequests, getProjects } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';
import type { ScopeRequest, Project } from '@/lib/supabase';
import ScopeDecisionBadge from '@/components/scope-decision-badge';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function RequestsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [requests, setRequests] = useState<ScopeRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setMounted(true);
      const userId = await getCurrentUserId();
      if (!userId) return;
      const [reqs, projs] = await Promise.all([getScopeRequests(), getProjects(userId)]);
      setRequests(reqs); setProjects(projs); setIsLoading(false);
    };
    loadData();
  }, []);

  if (!mounted) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': case 'reviewing': return <Clock className="w-4 h-4 text-blue-400" />;
      case 'clarification': return <HelpCircle className="w-4 h-4 text-amber-400" />;
      case 'decision': case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default: return <AlertCircle className="w-4 h-4 text-white/30" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = { submitted: 'Submitted', reviewing: 'Reviewing', clarification: 'Clarification', decision: 'Decision', completed: 'Completed' };
    return labels[status] || status;
  };

  const filteredRequests = requests.filter((req) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return ['submitted', 'reviewing'].includes(req.status);
    if (activeTab === 'clarification') return req.status === 'clarification';
    if (activeTab === 'decided') return ['decision', 'completed'].includes(req.status);
    return true;
  });

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Scope Requests</h1>
          <p className="text-white/40">Loading...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (<Card key={i} className="glass-card rounded-xl p-4 animate-pulse"><div className="h-4 bg-white/[0.04] rounded w-1/3 mb-2"></div><div className="h-3 bg-white/[0.04] rounded w-1/2"></div></Card>))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Scope Requests</h1>
        <p className="text-white/40">Review and manage client requests with AI-powered scope analysis</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending ({requests.filter((r) => ['submitted', 'reviewing'].includes(r.status)).length})</TabsTrigger>
          <TabsTrigger value="clarification">Clarification ({requests.filter((r) => r.status === 'clarification').length})</TabsTrigger>
          <TabsTrigger value="decided">Decided ({requests.filter((r) => ['decision', 'completed'].includes(r.status)).length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {filteredRequests.length === 0 ? (
            <Card className="glass-card rounded-xl p-12 text-center">
              <p className="text-white/30 mb-4">No requests found</p>
              <Button variant="outline" className="border-white/[0.06] bg-white/[0.02] text-white/60">Create New Request</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((request) => {
                const project = projects.find((p) => p.id === request.project_id);
                const decision = request.ai_analysis?.decision;
                return (
                  <Card key={request.id}
                    className="glass-card rounded-xl p-4 hover:border-white/10 transition-all cursor-pointer border-l-4"
                    onClick={() => router.push(`/dashboard/requests/${request.id}`)}
                    style={{ borderLeftColor: request.status === 'clarification' ? '#f59e0b' : request.status === 'decision' || request.status === 'completed' ? '#10b981' : '#3b82f6' }}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="col-span-1 md:col-span-2">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(request.status)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">{request.title}</h3>
                            <p className="text-sm text-white/40">{project?.name} • From {request.client_name}</p>
                            <p className="text-xs text-white/30 mt-1">{formatDate(request.submitted_at)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <p className="text-xs text-white/30 mb-1">Status</p>
                        <Badge variant="outline" className="text-xs border-white/10 text-white/60">{getStatusLabel(request.status)}</Badge>
                      </div>
                      <div className="col-span-1">
                        <p className="text-xs text-white/30 mb-1">AI Decision</p>
                        {decision ? <ScopeDecisionBadge decision={decision} size="sm" /> : <Badge className="text-xs bg-white/[0.04] text-white/40 border border-white/[0.06]">Pending</Badge>}
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
