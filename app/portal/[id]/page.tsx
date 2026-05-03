'use client';

import { useParams, useRouter } from 'next/navigation';
import { getProject, getScopeRequests, createScopeRequest } from '@/lib/database';
import type { Project, ScopeRequest } from '@/lib/supabase';
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
  const [requests, setRequests] = useState<ScopeRequest[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'submit' | 'view'>('submit');

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const [proj, reqs] = await Promise.all([
        getProject(projectId),
        getScopeRequests(projectId),
      ]);
      setProject(proj);
      setRequests(reqs);
      setIsLoading(false);
    };
    loadData();
  }, [projectId]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Project not found</p>
        </Card>
      </div>
    );
  }

  const getDecisionStats = () => {
    const inScope = requests.filter((r) => r.ai_analysis?.decision === 'in-scope').length;
    const outOfScope = requests.filter((r) => r.ai_analysis?.decision === 'out-of-scope').length;
    const needsInfo = requests.filter((r) => r.ai_analysis?.decision === 'needs-info').length;
    return { inScope, outOfScope, needsInfo };
  };

  const stats = getDecisionStats();

  const handleSubmit = async (data: { title: string; description: string; attachments: string[] }) => {
    const newRequest = await createScopeRequest({
      project_id: projectId,
      client_name: 'Portal User',
      client_email: '',
      title: data.title,
      description: data.description,
      attachments: data.attachments,
    });

    if (newRequest) {
      // Refresh requests list
      const updatedRequests = await getScopeRequests(projectId);
      setRequests(updatedRequests);
      setActiveTab('view');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => router.push('/portal')}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
          <p className="text-muted-foreground">{project.description}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-emerald-50 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">In Scope</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.inScope}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-600/10 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Out of Scope</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfScope}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-600/10 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Needs Clarification</p>
              <p className="text-2xl font-bold text-amber-600">{stats.needsInfo}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab('submit')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'submit'
              ? 'text-primary border-b-2 border-b-primary -mb-[2px]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Submit New Request
        </button>
        <button
          onClick={() => setActiveTab('view')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'view'
              ? 'text-primary border-b-2 border-b-primary -mb-[2px]'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          View Previous Requests ({requests.length})
        </button>
      </div>

      {/* Submit Form */}
      {activeTab === 'submit' && (
        <RequestSubmissionForm
          projectId={projectId}
          projectName={project.name}
          onSubmit={handleSubmit}
        />
      )}

      {/* Request List */}
      {activeTab === 'view' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No previous requests yet</p>
              <Button onClick={() => setActiveTab('submit')}>Submit Your First Request</Button>
            </Card>
          ) : (
            requests.map((request) => (
              <Card
                key={request.id}
                className="p-6 hover:shadow-md transition-all border-l-4"
                style={{
                  borderLeftColor:
                    request.status === 'clarification'
                      ? '#f59e0b'
                      : request.status === 'decision'
                      ? '#10b981'
                      : '#3b82f6',
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {request.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Submitted on{' '}
                        {new Date(request.submitted_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    {request.ai_analysis && (
                      <ScopeDecisionBadge decision={request.ai_analysis.decision} />
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {request.description}
                  </p>

                  {request.ai_analysis && (
                    <div className="p-3 bg-muted rounded text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Decision:</span>{' '}
                        {Array.isArray(request.ai_analysis.reasoning) 
                          ? request.ai_analysis.reasoning.join('. ')
                          : request.ai_analysis.reasoning}
                      </p>
                    </div>
                  )}

                  {request.status === 'clarification' &&
                    request.ai_analysis?.clarificationQuestions && (
                      <Card className="p-4 bg-amber-50 border-amber-200">
                        <p className="font-medium text-sm text-foreground mb-2">
                          Questions Need Answering:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {request.ai_analysis.clarificationQuestions.map((q, idx) => (
                            <li key={idx}>• {typeof q === 'string' ? q : q.question}</li>
                          ))}
                        </ul>
                      </Card>
                    )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
