'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { getProject, getScopeRequests, updateProject } from '@/lib/database';
import type { Project, ScopeRequest } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, ExternalLink, Mail, Check, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [scopeRequests, setScopeRequests] = useState<ScopeRequest[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadData = async () => {
      const [proj, reqs] = await Promise.all([getProject(projectId), getScopeRequests(projectId)]);
      setProject(proj); setScopeRequests(reqs); setIsLoading(false);
    };
    loadData();
  }, [projectId]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Button variant="outline" onClick={() => router.back()} className="gap-2 border-white/[0.06] bg-white/[0.02] text-white/60">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/[0.04] rounded w-1/3"></div>
          <div className="h-4 bg-white/[0.04] rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()} className="gap-2 border-white/[0.06] bg-white/[0.02] text-white/60">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Card className="glass-card rounded-xl p-12 text-center">
          <p className="text-white/30">Project not found</p>
        </Card>
      </div>
    );
  }

  const portalUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/portal/p/${project.portal_token}`;

  const handleCopyPortalUrl = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResendEmail = () => {
    const subject = encodeURIComponent(`Your project portal is ready — ${project.name}`);
    const body = encodeURIComponent(
      `Hi ${project.client_name},\n\nYour project "${project.name}" portal is now live.\n\nAccess your dashboard here:\n${portalUrl}\n\nYou can submit requests, track progress, and communicate with us directly through this portal.\n\nBest regards`
    );
    window.open(`mailto:${project.client_email}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleTogglePortal = async (enabled: boolean) => {
    const updated = await updateProject(project.id, { portal_enabled: enabled });
    if (updated) setProject(updated);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'paused': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'completed': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default: return 'bg-white/5 text-white/50';
    }
  };

  const chartData = [
    { month: 'Jan', budget: 8000, spent: 2000 },
    { month: 'Feb', budget: 10000, spent: 4000 },
    { month: 'Mar', budget: 12000, spent: 8000 },
    { month: 'Apr', budget: 15000, spent: 10000 },
    { month: 'May', budget: 18000, spent: 16000 },
    { month: 'Jun', budget: 20000, spent: 18000 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button variant="outline" onClick={() => router.back()} className="gap-2 mb-4 border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Projects
      </Button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
          <p className="text-white/40 mb-4">{project.description}</p>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
            <span className="text-sm text-white/30">Client: {project.client_name}</span>
            {project.portal_enabled && (
              <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Globe className="w-3 h-3 mr-1" /> Portal Active
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requests">Requests ({scopeRequests.length})</TabsTrigger>
          <TabsTrigger value="portal">Client Portal</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass-card rounded-xl p-6">
              <p className="text-xs text-white/30 mb-2">Total Requests</p>
              <p className="text-3xl font-bold text-white">{project.request_count}</p>
              <p className="text-xs text-white/30 mt-2">{project.scope_analytics?.inScope || 0} in-scope, {project.scope_analytics?.outOfScope || 0} out-of-scope</p>
            </Card>
            <Card className="glass-card rounded-xl p-6">
              <p className="text-xs text-white/30 mb-2">Active Tasks</p>
              <p className="text-3xl font-bold text-white">{project.task_count}</p>
              <p className="text-xs text-white/30 mt-2">{Math.floor(project.task_count * 0.7)} completed</p>
            </Card>
            <Card className="glass-card rounded-xl p-6">
              <p className="text-xs text-white/30 mb-2">Client</p>
              <p className="text-lg font-bold text-white truncate">{project.client_name}</p>
              <p className="text-xs text-white/30 mt-2 truncate">{project.client_email}</p>
            </Card>
            <Card className="glass-card rounded-xl p-6">
              <p className="text-xs text-white/30 mb-2">Portal Status</p>
              <p className="text-lg font-bold text-white">{project.portal_enabled ? 'Active' : 'Disabled'}</p>
              <p className="text-xs text-white/30 mt-2">
                {project.portal_enabled ? 'Clients can submit requests' : 'Portal access disabled'}
              </p>
            </Card>
          </div>

          <Card className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Activity Tracking</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.3)' }} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.3)' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F1629', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="budget" stroke="#3b82f6" strokeWidth={2} name="Budget" />
                <Line type="monotone" dataKey="spent" stroke="#f43f5e" strokeWidth={2} name="Spent" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4 mt-6">
          {scopeRequests.length === 0 ? (
            <Card className="glass-card rounded-xl p-12 text-center"><p className="text-white/30">No scope requests yet</p></Card>
          ) : (
            scopeRequests.map((request) => (
              <Card key={request.id} className="glass-card rounded-xl p-4 hover:border-white/10 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">{request.title}</h4>
                    <p className="text-sm text-white/40 mt-1">From {request.client_name}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/requests/${request.id}`)}
                    className="border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white">View</Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="portal" className="space-y-6 mt-6">
          {/* Portal URL Card */}
          <Card className="glass-card-strong rounded-xl p-6 border-blue-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Client Portal URL</h3>
                <p className="text-xs text-white/40">Share this unique link with your client</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <code className="flex-1 bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl text-sm text-blue-400 truncate font-mono">
                {portalUrl}
              </code>
              <Button variant="outline" size="icon" onClick={handleCopyPortalUrl}
                className="border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => window.open(portalUrl, '_blank')}
                className="border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
            {copied && <p className="text-xs text-emerald-400 animate-in fade-in duration-200">✓ Copied to clipboard</p>}
          </Card>

          {/* Send / Resend Email */}
          <Card className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Send Portal Invitation</h3>
                <p className="text-xs text-white/40">Email the portal link to {project.client_email}</p>
              </div>
            </div>
            <Button onClick={handleResendEmail}
              className="w-full btn-gradient text-white border-0 rounded-xl h-11 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" /> Send / Resend Email Invitation
            </Button>
          </Card>

          {/* Portal Toggle */}
          <Card className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  project.portal_enabled
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-white/[0.04] border border-white/[0.06]'
                }`}>
                  <Globe className={`w-5 h-5 ${project.portal_enabled ? 'text-emerald-400' : 'text-white/30'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Portal Access</h3>
                  <p className="text-xs text-white/40">
                    {project.portal_enabled ? 'Client can access the portal and submit requests' : 'Portal is disabled — link will show an error'}
                  </p>
                </div>
              </div>
              <Switch checked={project.portal_enabled} onCheckedChange={handleTogglePortal} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Project Details</h3>
            <div className="space-y-4">
              <div><p className="text-sm text-white/30 mb-1">Client Name</p><p className="text-white/70">{project.client_name}</p></div>
              <div><p className="text-sm text-white/30 mb-1">Client Email</p><p className="text-white/70">{project.client_email}</p></div>
              <div><p className="text-sm text-white/30 mb-1">Created</p><p className="text-white/70">{new Date(project.created_at).toLocaleDateString()}</p></div>
              <div><p className="text-sm text-white/30 mb-1">Status</p><p className="text-white/70 capitalize">{project.status}</p></div>
            </div>
          </Card>

          <Card className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Scope Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-xs text-white/30 mb-1">Total Requests</p><p className="text-2xl font-bold text-white">{project.scope_analytics?.totalRequests || 0}</p></div>
              <div><p className="text-xs text-white/30 mb-1">In Scope</p><p className="text-2xl font-bold text-emerald-400">{project.scope_analytics?.inScope || 0}</p></div>
              <div><p className="text-xs text-white/30 mb-1">Out of Scope</p><p className="text-2xl font-bold text-red-400">{project.scope_analytics?.outOfScope || 0}</p></div>
              <div><p className="text-xs text-white/30 mb-1">Needs Info</p><p className="text-2xl font-bold text-amber-400">{project.scope_analytics?.needsInfo || 0}</p></div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
