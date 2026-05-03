'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/components/stat-card';
import { RequestsTable } from '@/components/requests-table';
import { ProjectsGrid } from '@/components/projects-grid';
import { getSession } from '@/lib/auth';
import { getScopeRequests } from '@/lib/database';
import type { ScopeRequest } from '@/lib/supabase';
import { AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ScopeDecisionBadge from '@/components/scope-decision-badge';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scopeRequests, setScopeRequests] = useState<ScopeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const auth = await getSession();
      if (!auth.isAuthenticated) {
        router.push('/login');
        return;
      }
      setIsAuthorized(true);
      setMounted(true);

      // Fetch scope requests
      const requests = await getScopeRequests();
      setScopeRequests(requests);
      setIsLoading(false);
    };
    init();
  }, [router]);

  if (!isAuthorized || !mounted) {
    return null;
  }

  const pendingCount = scopeRequests.filter((r) => ['submitted', 'reviewing'].includes(r.status)).length;
  const clarificationCount = scopeRequests.filter((r) => r.status === 'clarification').length;
  const decisionCount = scopeRequests.filter((r) => ['decision', 'completed'].includes(r.status)).length;
  const recentRequests = scopeRequests.slice(0, 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Requests"
          value={String(pendingCount)}
          change={15}
          trend="up"
          icon={AlertCircle}
        />
        <StatCard
          title="Awaiting Clarification"
          value={String(clarificationCount)}
          change={3}
          trend="up"
          icon={Clock}
        />
        <StatCard
          title="Decisions Made"
          value={String(decisionCount)}
          change={8}
          trend="up"
          icon={CheckCircle2}
        />
        <StatCard
          title="Total Requests"
          value={String(scopeRequests.length)}
          change={22}
          trend="up"
          icon={Zap}
        />
      </div>

      {/* Recent Scope Requests */}
      <div className="animate-in fade-in duration-500 delay-100">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Recent Scope Requests</h2>
              <p className="text-sm text-muted-foreground mt-1">AI-analyzed change requests from clients</p>
            </div>
            <Link href="/dashboard/requests">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg border animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No scope requests yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/dashboard/requests/${request.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">
                        {request.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        From {request.client_name} • {new Date(request.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    {request.ai_analysis && (
                      <ScopeDecisionBadge decision={request.ai_analysis.decision} size="sm" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Change Requests Table */}
      <div className="animate-in fade-in duration-500 delay-100">
        <RequestsTable />
      </div>

      {/* Projects */}
      <div className="animate-in fade-in duration-500 delay-200">
        <ProjectsGrid />
      </div>
    </div>
  );
}
