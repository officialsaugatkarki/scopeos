'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProject, getScopeRequests } from '@/lib/database';
import type { Project, ScopeRequest } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [scopeRequests, setScopeRequests] = useState<ScopeRequest[]>([]);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const [proj, reqs] = await Promise.all([
        getProject(projectId),
        getScopeRequests(projectId),
      ]);
      setProject(proj);
      setScopeRequests(reqs);
      setIsLoading(false);
    };
    loadData();
  }, [projectId]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">Project not found</p>
        </Card>
      </div>
    );
  }

  const budgetUsage = project.budget > 0 ? (project.spent / project.budget) * 100 : 0;
  const chartData = [
    { month: 'Jan', budget: 8000, spent: 2000 },
    { month: 'Feb', budget: 10000, spent: 4000 },
    { month: 'Mar', budget: 12000, spent: 8000 },
    { month: 'Apr', budget: 15000, spent: 10000 },
    { month: 'May', budget: 18000, spent: 16000 },
    { month: 'Jun', budget: 20000, spent: 18000 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'paused':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const portalUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/portal/${project.id}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="gap-2 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {project.name}
          </h1>
          <p className="text-muted-foreground mb-4">
            {project.description}
          </p>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Client: {project.client_name}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">
            Requests ({scopeRequests.length})
          </TabsTrigger>
          <TabsTrigger value="baseline">Scope Baseline</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <p className="text-xs text-muted-foreground mb-2">Total Requests</p>
              <p className="text-3xl font-bold">{project.request_count}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {project.scope_analytics?.inScope || 0} in-scope, {project.scope_analytics?.outOfScope || 0} out-of-scope
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-xs text-muted-foreground mb-2">Active Tasks</p>
              <p className="text-3xl font-bold">{project.task_count}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.floor(project.task_count * 0.7)} completed
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-xs text-muted-foreground mb-2">Budget Used</p>
              <p className="text-3xl font-bold">{Math.round(budgetUsage)}%</p>
              <p className="text-xs text-muted-foreground mt-2">
                ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-xs text-muted-foreground mb-2">Timeline</p>
              <p className="text-3xl font-bold">
                {project.end_date
                  ? Math.round(
                      (new Date(project.end_date).getTime() -
                        new Date(project.start_date).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  : 'N/A'}
              </p>
              <p className="text-xs text-muted-foreground mt-2">days duration</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Tracking</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="budget"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  name="Budget"
                />
                <Line
                  type="monotone"
                  dataKey="spent"
                  stroke="var(--destructive)"
                  strokeWidth={2}
                  name="Spent"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4 mt-6">
          {scopeRequests.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No scope requests yet</p>
            </Card>
          ) : (
            scopeRequests.map((request) => (
              <Card key={request.id} className="p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">
                      {request.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      From {request.client_name}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/requests/${request.id}`)}
                  >
                    View
                  </Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="baseline" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Original Scope Baseline</h3>
            <p className="text-foreground leading-relaxed">
              {project.scope_baseline}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Scope Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Requests</p>
                <p className="text-2xl font-bold">
                  {project.scope_analytics?.totalRequests || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">In Scope</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {project.scope_analytics?.inScope || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Out of Scope</p>
                <p className="text-2xl font-bold text-red-600">
                  {project.scope_analytics?.outOfScope || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Needs Info</p>
                <p className="text-2xl font-bold text-amber-600">
                  {project.scope_analytics?.needsInfo || 0}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Client Email</p>
                <p className="text-foreground">{project.client_email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                <p className="text-foreground">
                  {new Date(project.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Budget</p>
                <p className="text-foreground">
                  ${project.budget.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Client Portal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Share this link with your client to submit scope requests
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted p-3 rounded text-sm text-foreground truncate">
                {portalUrl}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigator.clipboard.writeText(portalUrl)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(portalUrl)}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
