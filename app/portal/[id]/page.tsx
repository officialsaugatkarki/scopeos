'use client';

import { useParams, useRouter } from 'next/navigation';
import { getProject, getRequests, createRequest } from '@/lib/database';
import type { Project, Request } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import RequestSubmissionForm from '@/components/request-submission-form';
import ScopeDecisionBadge from '@/components/scope-decision-badge';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export default function ProjectPortalPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'submit' | 'view'>('submit');

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const [proj, reqs] = await Promise.all([getProject(projectId), getRequests(projectId)]);
      setProject(proj); setRequests(reqs); setIsLoading(false);
    };
    loadData();
  }, [projectId]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-white/[0.04] rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-white/[0.04] rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Button onClick={() => router.back()} variant="ghost" className="gap-2 text-white/40 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Card className="glass-card rounded-xl p-8 text-center">
          <p className="text-white/30 mb-4">Project not found</p>
        </Card>
      </div>
    );
  }

  const getDecisionStats = () => {
    const inScope = requests.filter((r) => r.ai_decision === 'in-scope').length;
    const outOfScope = requests.filter((r) => r.ai_decision === 'out-of-scope').length;
    const needsInfo = requests.filter((r) => r.ai_decision === 'needs-info').length;
    return { inScope, outOfScope, needsInfo };
  };

  const stats = getDecisionStats();

  const handleSubmit = async (data: { title: string; description: string; attachments: string[] }) => {
    const newRequest = await createRequest({
      project_id: projectId,
      client_id: 'portal_user',
      message: `${data.title}\n\n${data.description}`,
      ai_decision: 'pending',
      confidence_score: 0,
      reasoning: '',
      estimated_impact: '',
      status: 'submitted'
    });
    
    if (newRequest) {
      const updatedRequests = await getRequests(projectId);
      setRequests(updatedRequests); 
      setActiveTab('view');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button onClick={() => router.push('/portal')} variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.04]">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          <p className="text-white/40">{project.description}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card rounded-xl p-4 border-emerald-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-white/30">In Scope</p>
              <p className="text-2xl font-bold text-emerald-400">{stats.inScope}</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card rounded-xl p-4 border-red-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-white/30">Out of Scope</p>
              <p className="text-2xl font-bold text-red-400">{stats.outOfScope}</p>
            </div>
          </div>
        </Card>
        <Card className="glass-card rounded-xl p-4 border-amber-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-white/30">Needs Clarification</p>
              <p className="text-2xl font-bold text-amber-400">{stats.needsInfo}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/[0.06]">
        <button onClick={() => setActiveTab('submit')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'submit' ? 'text-blue-400 border-b-2 border-b-blue-400 -mb-[2px]' : 'text-white/40 hover:text-white/60'}`}>
          Submit New Request
        </button>
        <button onClick={() => setActiveTab('view')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${activeTab === 'view' ? 'text-blue-400 border-b-2 border-b-blue-400 -mb-[2px]' : 'text-white/40 hover:text-white/60'}`}>
          View Previous Requests ({requests.length})
        </button>
      </div>

      {/* Submit Form */}
      {activeTab === 'submit' && (
        <RequestSubmissionForm projectId={projectId} projectName={project.name} onSubmit={handleSubmit} />
      )}

      {/* Request List */}
      {activeTab === 'view' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card className="glass-card rounded-xl p-6 md:p-12 text-center">
              <p className="text-white/30 mb-4">No previous requests yet</p>
              <Button onClick={() => setActiveTab('submit')} className="btn-gradient text-white border-0 rounded-xl">Submit Your First Request</Button>
            </Card>
          ) : (
            requests.map((request) => {
              const title = request.message.split('\n')[0].substring(0, 50) + (request.message.length > 50 ? '...' : '');
              
              return (
              <Card key={request.id}
                className="glass-card rounded-xl p-6 hover:border-white/10 transition-all border-l-4"
                style={{ borderLeftColor: request.ai_decision === 'needs-info' ? '#f59e0b' : request.ai_decision === 'in-scope' ? '#10b981' : request.ai_decision === 'out-of-scope' ? '#ef4444' : '#3b82f6' }}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{title}</h3>
                      <p className="text-sm text-white/40">
                        Submitted on {new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    {request.ai_decision && <ScopeDecisionBadge decision={request.ai_decision as any} />}
                  </div>
                  <p className="text-sm text-white/40 line-clamp-2">{request.message}</p>
                  {request.ai_decision && request.reasoning && (
                    <div className="p-3 bg-white/[0.02] rounded-lg border border-white/[0.04] text-sm">
                      <p className="text-white/40">
                        <span className="font-medium text-white/60">Decision:</span>{' '}
                        {request.reasoning}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )})
          )}
        </div>
      )}
    </div>
  );
}
