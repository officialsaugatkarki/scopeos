'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatCard } from '@/components/stat-card';
import { RequestsTable } from '@/components/requests-table';
import { ProjectsGrid } from '@/components/projects-grid';
import { getSession } from '@/lib/auth';
import { getRequests } from '@/lib/database';
import type { Request } from '@/lib/supabase';
import { AlertCircle, CheckCircle2, Clock, Zap, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ScopeDecisionBadge from '@/components/scope-decision-badge';

export default function DashboardPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const auth = await getSession();
      if (!auth.isAuthenticated) { router.push('/login'); return; }
      setIsAuthorized(true); setMounted(true);
      // Pass userId so getRequests only returns this user's data
      const data = await getRequests(undefined, auth.user!.id);
      setRequests(data); setIsLoading(false);
    };
    init();
  }, [router]);

  if (!isAuthorized || !mounted) return null;

  const pendingCount = requests.filter((r) => ['pending', 'analyzed'].includes(r.status)).length;
  const clarificationCount = requests.filter((r) => r.ai_decision === 'needs-info').length;
  const decisionCount = requests.filter((r) => ['in-scope', 'out-of-scope'].includes(r.ai_decision)).length;
  const recentRequests = requests.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active Requests" value={String(pendingCount)} icon={AlertCircle} trend="+3 today" trendUp={true} />
        <StatCard title="Awaiting Clarification" value={String(clarificationCount)} icon={Clock} trend="Needs attention" trendUp={false} />
        <StatCard title="Decisions Made" value={String(decisionCount)} icon={CheckCircle2} trend="+12 this week" trendUp={true} />
        <StatCard title="Total Requests" value={String(requests.length)} icon={Zap} trend="All time" trendUp={true} />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Wider) - Recent Scope Requests */}
        <div className="xl:col-span-2 space-y-8">
          <div className="animate-in fade-in duration-500 delay-100">
            <Card className="bg-white border border-[#E2E8F4] rounded-2xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-[#E2E8F4] bg-slate-50/50">
                <div>
                  <h2 className="text-lg font-bold text-[#0D1526]">Recent Scope Requests</h2>
                  <p className="text-sm text-[#64748B] mt-1">AI-analyzed change requests needing review</p>
                </div>
                <Link href="/dashboard/requests">
                  <Button variant="outline" size="sm" className="hidden sm:flex gap-2 text-[#2563EB] border-blue-200 hover:bg-blue-50 hover:text-blue-700 bg-white shadow-sm rounded-full">
                    View All <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="p-0">
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : recentRequests.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <h3 className="text-base font-semibold text-[#0D1526] mb-1">No requests yet</h3>
                    <p className="text-sm text-[#64748B]">When clients submit requests, they'll appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E2E8F4]">
                    {recentRequests.map((request) => (
                      <div key={request.id}
                        className="p-5 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                        onClick={() => router.push(`/dashboard/requests/${request.id}`)}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#0D1526] text-base group-hover:text-[#2563EB] transition-colors truncate">
                              {request.message}
                            </h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-medium text-[#64748B]">Project ID: {request.project_id.substring(0, 8)}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-xs text-[#94A3B8]">{new Date(request.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2">
                            {request.ai_decision && <ScopeDecisionBadge decision={request.ai_decision as any} size="sm" />}
                            <span className="text-xs font-semibold text-[#2563EB] opacity-0 group-hover:opacity-100 transition-opacity">
                              Review →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="animate-in fade-in duration-500 delay-200">
            <h2 className="text-lg font-bold text-white mb-4">Active Projects</h2>
            <ProjectsGrid />
          </div>
        </div>

        {/* Right Column (Narrower) */}
        <div className="xl:col-span-1 space-y-8">
          <div className="animate-in fade-in duration-500 delay-300">
            <h2 className="text-lg font-bold text-white mb-4">All Requests Overview</h2>
            <div className="bg-white border border-[#E2E8F4] rounded-2xl shadow-sm overflow-hidden p-1">
               <RequestsTable />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
