'use client';

import { useRouter } from 'next/navigation';
import { usePortal } from '@/components/portal-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Activity,
  MessageSquare,
  FileText,
  DollarSign,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Zap,
  TrendingUp,
  Calendar,
  Target,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PortalDashboardPage() {
  const router = useRouter();
  const { project, token, requests, changeRequests, messages } = usePortal();

  if (!project) return null;

  const basePath = `/portal/p/${token}`;

  // Compute stats
  const inScopeCount = requests.filter(r => r.ai_analysis?.decision === 'in-scope').length;
  const outOfScopeCount = requests.filter(r => r.ai_analysis?.decision === 'out-of-scope').length;
  const pendingCount = requests.filter(r => !r.ai_analysis || r.status === 'submitted' || r.status === 'reviewing').length;
  const pendingApprovals = changeRequests.filter(cr => cr.status === 'pending').length;
  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === 'completed' || r.status === 'decision').length;
  const progressPercent = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;

  // Budget
  const budgetUsed = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;

  // Recent activity — merge messages and requests, sort by date, take last 8
  const recentActivity = [
    ...messages.slice(-10).map(m => ({
      id: m.id,
      type: m.role === 'client' ? 'message_sent' : 'ai_response',
      title: m.role === 'client' ? 'You sent a message' : 'AI responded',
      description: m.content.substring(0, 80) + (m.content.length > 80 ? '...' : ''),
      date: m.created_at,
      icon: m.role === 'client' ? MessageSquare : Zap,
      color: m.role === 'client' ? 'blue' : 'cyan',
    })),
    ...requests.slice(0, 5).map(r => ({
      id: r.id,
      type: 'scope_decision',
      title: r.title,
      description: r.ai_analysis?.decision === 'in-scope' ? 'Approved — In Scope' :
                    r.ai_analysis?.decision === 'out-of-scope' ? 'Out of Scope — Change Request Created' :
                    r.ai_analysis?.decision === 'needs-info' ? 'Needs More Information' : 'Pending Review',
      date: r.submitted_at || r.created_at,
      icon: r.ai_analysis?.decision === 'in-scope' ? CheckCircle2 :
            r.ai_analysis?.decision === 'out-of-scope' ? XCircle :
            r.ai_analysis?.decision === 'needs-info' ? HelpCircle : Clock,
      color: r.ai_analysis?.decision === 'in-scope' ? 'emerald' :
             r.ai_analysis?.decision === 'out-of-scope' ? 'red' :
             r.ai_analysis?.decision === 'needs-info' ? 'amber' : 'blue',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="gradient-text-blue">{project.client_name}</span>
        </h1>
        <p className="text-white/40 text-sm md:text-base">{project.name} — {project.description || 'Your project workspace'}</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Project Status */}
        <Card className="glass-card rounded-xl p-4 glow-border-hover transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-white/30 uppercase tracking-wider">Status</p>
              <p className="text-lg font-bold text-emerald-400 capitalize">{project.status}</p>
            </div>
          </div>
        </Card>

        {/* Active Requests */}
        <Card className="glass-card rounded-xl p-4 glow-border-hover transition-all cursor-pointer" onClick={() => router.push(`${basePath}/requests`)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-white/30 uppercase tracking-wider">Requests</p>
              <p className="text-lg font-bold text-white">{totalRequests}</p>
            </div>
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="glass-card rounded-xl p-4 glow-border-hover transition-all cursor-pointer" onClick={() => router.push(`${basePath}/changes`)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-white/30 uppercase tracking-wider">Pending</p>
              <p className="text-lg font-bold text-amber-400">{pendingApprovals}</p>
            </div>
          </div>
        </Card>

        {/* Scope Distribution */}
        <Card className="glass-card rounded-xl p-4 glow-border-hover transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-white/30 uppercase tracking-wider">In Scope</p>
              <p className="text-lg font-bold text-white">{inScopeCount}<span className="text-white/30 text-sm font-normal">/{totalRequests}</span></p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Activity Feed — 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          {/* Progress Card */}
          <Card className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-white text-sm">Project Progress</h3>
              </div>
              <span className="text-sm font-bold text-blue-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-white/30">
              <span>{completedRequests} processed</span>
              <span>{pendingCount} pending</span>
            </div>
          </Card>

          {/* Scope Overview Bars */}
          <Card className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              Scope Overview
            </h3>
            <div className="space-y-3">
              {/* In Scope */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs text-white/60">In Scope</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-400">{inScopeCount}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500/60 transition-all duration-500" style={{ width: totalRequests > 0 ? `${(inScopeCount / totalRequests) * 100}%` : '0%' }} />
                </div>
              </div>
              {/* Out of Scope */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-xs text-white/60">Out of Scope</span>
                  </div>
                  <span className="text-xs font-medium text-red-400">{outOfScopeCount}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full rounded-full bg-red-500/60 transition-all duration-500" style={{ width: totalRequests > 0 ? `${(outOfScopeCount / totalRequests) * 100}%` : '0%' }} />
                </div>
              </div>
              {/* Pending */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs text-white/60">Pending / Needs Info</span>
                  </div>
                  <span className="text-xs font-medium text-amber-400">{pendingCount}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500/60 transition-all duration-500" style={{ width: totalRequests > 0 ? `${(pendingCount / totalRequests) * 100}%` : '0%' }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Recent Activity
            </h3>
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/30 text-sm">No activity yet</p>
                <p className="text-white/20 text-xs mt-1">Start a conversation with AI to see updates here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((item) => {
                  const Icon = item.icon;
                  const colors = colorMap[item.color] || colorMap.blue;
                  return (
                    <div key={item.id} className="flex items-start gap-3 group">
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${colors}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white/80 font-medium truncate">{item.title}</p>
                        <p className="text-xs text-white/30 truncate">{item.description}</p>
                      </div>
                      <span className="text-[10px] text-white/20 flex-shrink-0 mt-1">
                        {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                onClick={() => router.push(`${basePath}/chat`)}
                className="w-full btn-gradient text-white border-0 rounded-xl h-11 text-sm justify-between group"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Start AI Chat
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button
                onClick={() => router.push(`${basePath}/requests`)}
                variant="outline"
                className="w-full border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white rounded-xl h-11 text-sm justify-between group"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  View Requests
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button
                onClick={() => router.push(`${basePath}/changes`)}
                variant="outline"
                className="w-full border-white/[0.06] bg-white/[0.02] text-white/60 hover:bg-white/[0.06] hover:text-white rounded-xl h-11 text-sm justify-between group"
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Change Requests
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </div>
          </Card>

          {/* Budget Overview */}
          {project.budget > 0 && (
            <Card className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-400" />
                Budget
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-bold text-white">${project.spent.toLocaleString()}</span>
                  <span className="text-sm text-white/30">/ ${project.budget.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 70 ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                    style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-white/30">{budgetUsed}% used</p>
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Start Date</span>
                <span className="text-xs text-white/70 font-medium">
                  {project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">End Date</span>
                <span className="text-xs text-white/70 font-medium">
                  {project.end_date ? new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Duration</span>
                <span className="text-xs text-white/70 font-medium">
                  {project.start_date ? formatDistanceToNow(new Date(project.start_date)) : '—'}
                </span>
              </div>
            </div>
          </Card>

          {/* AI Status */}
          <Card className="glass-card rounded-xl p-5 border-blue-500/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">ScopeOS AI</h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                </p>
              </div>
            </div>
            <p className="text-xs text-white/30">
              Your AI assistant is ready to analyze requests, provide scope decisions, and handle change orders automatically.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
