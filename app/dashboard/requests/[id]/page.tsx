'use client';

import { useParams, useRouter } from 'next/navigation';
import { getScopeRequest, getProjects } from '@/lib/database';
import { getCurrentUserId } from '@/lib/auth';
import type { ScopeRequest, ScopeRequestHistory, Project } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import AIAnalysisCard from '@/components/ai-analysis-card';
import RequestTimeline from '@/components/request-timeline';
import RequestActionsPanel from '@/components/request-actions-panel';
import ScopeDecisionBadge from '@/components/scope-decision-badge';
import ClarificationPanel from '@/components/clarification-panel';
import { ArrowLeft, User, Mail, Calendar } from 'lucide-react';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params?.id as string;
  const [mounted, setMounted] = useState(false);
  const [request, setRequest] = useState<(ScopeRequest & { history: ScopeRequestHistory[] }) | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const req = await getScopeRequest(requestId);
      setRequest(req);

      if (req) {
        const userId = await getCurrentUserId();
        if (userId) {
          const projs = await getProjects(userId);
          const proj = projs.find((p) => p.id === req.project_id);
          setProject(proj || null);
        }
      }
      setIsLoading(false);
    };
    loadData();
  }, [requestId]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-48 mb-2"></div>
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">Request not found</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-50 border-blue-200';
      case 'reviewing':
        return 'bg-purple-50 border-purple-200';
      case 'clarification':
        return 'bg-amber-50 border-amber-200';
      case 'decision':
        return 'bg-green-50 border-green-200';
      case 'completed':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    const labels: Record<string, string> = {
      submitted: 'Submitted',
      reviewing: 'AI Reviewing',
      clarification: 'Clarification Needed',
      decision: 'Decision Made',
      completed: 'Completed',
    };
    return labels[status] || status;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Adapt request data to the format expected by child components
  const adaptedRequest = {
    ...request,
    // Map snake_case to camelCase for child components
    clientName: request.client_name,
    clientEmail: request.client_email,
    clientId: request.client_id,
    projectId: request.project_id,
    submittedAt: request.submitted_at,
    aiAnalysis: request.ai_analysis,
    pmNotes: request.pm_notes,
    createdDraftAt: request.created_draft_at,
    completedAt: request.completed_at,
    history: (request.history || []).map((h) => ({
      timestamp: h.created_at,
      action: h.action,
      actor: h.actor,
      details: h.details,
    })),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{request.title}</h1>
          <p className="text-muted-foreground">Project: {project?.name || 'Unknown'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card className={`p-6 border-2 ${getStatusColor(request.status)}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Request Status</h2>
              <Badge variant="outline">{getStatusBadge(request.status)}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">Submitted</p>
                <p className="font-medium text-foreground">{formatDate(request.submitted_at)}</p>
              </div>
              {request.created_draft_at && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Draft Created</p>
                  <p className="font-medium text-foreground">{formatDate(request.created_draft_at)}</p>
                </div>
              )}
              {request.completed_at && (
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Completed</p>
                  <p className="font-medium text-foreground">{formatDate(request.completed_at)}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Client Info */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Client Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{request.client_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{request.client_email}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Request Description */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-3">Request Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {request.description}
            </p>
          </Card>

          {/* AI Analysis */}
          {request.ai_analysis && (
            <AIAnalysisCard analysis={request.ai_analysis} />
          )}

          {/* Clarification Panel */}
          {request.status === 'clarification' &&
            request.ai_analysis?.clarificationQuestions && (
              <ClarificationPanel
                questions={request.ai_analysis.clarificationQuestions}
                onSubmit={(answers) => {
                  console.log('Clarification answers:', answers);
                }}
              />
            )}

          {/* PM Notes */}
          {request.pm_notes && (
            <Card className="p-6 border-l-4 border-l-amber-500 bg-amber-50/30">
              <h3 className="font-semibold text-foreground mb-2">PM Notes</h3>
              <p className="text-sm text-muted-foreground italic">{request.pm_notes}</p>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <RequestActionsPanel
            requestId={request.id}
            currentStatus={request.status}
            onApprove={() => console.log('Approved')}
            onReject={() => console.log('Rejected')}
            onEscalate={() => console.log('Escalated')}
          />

          <RequestTimeline request={adaptedRequest} />
        </div>
      </div>
    </div>
  );
}
