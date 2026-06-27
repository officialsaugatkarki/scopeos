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
  const { project, token, requests, messages } = usePortal();

  if (!project) return null;

  const basePath = `/portal/p/${token}`;

  // Compute stats
  const inScopeCount = requests.filter(r => r.ai_decision === 'in-scope').length;
  const outOfScopeCount = requests.filter(r => r.ai_decision === 'out-of-scope').length;
  const pendingCount = requests.filter(r => r.status === 'pending' || r.status === 'analyzed').length;

  const changeRequests = requests.filter(r => r.ai_decision === 'out-of-scope');
  const pendingApprovals = changeRequests.filter(cr => cr.status === 'pending' || cr.status === 'analyzed').length;

  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === 'completed').length;
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
      color: m.role === 'client' ? 'blue' : 'blue',
    })),
    ...requests.slice(0, 5).map(r => ({
      id: r.id,
      type: 'scope_decision',
      title: r.message.substring(0, 50) + (r.message.length > 50 ? '...' : ''),
      description: r.ai_decision === 'in-scope' ? 'Approved — In Scope' :
                    r.ai_decision === 'out-of-scope' ? 'Out of Scope — Change Request Created' :
                    r.ai_decision === 'needs-info' ? 'Needs More Information' : 'Pending Review',
      date: r.created_at,
      icon: r.ai_decision === 'in-scope' ? CheckCircle2 :
            r.ai_decision === 'out-of-scope' ? XCircle :
            r.ai_decision === 'needs-info' ? HelpCircle : Clock,
      color: r.ai_decision === 'in-scope' ? 'emerald' :
             r.ai_decision === 'out-of-scope' ? 'red' :
             r.ai_decision === 'needs-info' ? 'amber' : 'slate',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  const colorMap: Record<string, string> = {
    blue: 'text-[#2563EB] bg-blue-50 border-blue-100',
    cyan: 'text-[#06b6d4] bg-cyan-50 border-cyan-100',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    red: 'text-red-600 bg-red-50 border-red-100',
    amber: 'text-amber-600 bg-amber-50 border-amber-100',
    slate: 'text-[#64748B] bg-slate-50 border-slate-200',
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="space-y-1 mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-[#0D1526] tracking-tight">
          Welcome back, <span className="text-[#2563EB]">{project.client_name}</span>
        </h1>
        <p className="text-[#64748B] text-sm md:text-base font-medium">{project.name} — {project.description || 'Your project workspace'}</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Project Status */}
        <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">Status</p>
              <p className="text-lg font-black text-[#0D1526] capitalize">{project.status}</p>
            </div>
          </div>
        </Card>

        {/* Active Requests */}
        <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push(`${basePath}/requests`)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <FileText className="w-6 h-6 text-[#2563EB]" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">Requests</p>
              <p className="text-lg font-black text-[#0D1526]">{totalRequests}</p>
            </div>
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => router.push(`${basePath}/changes`)}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <DollarSign className="w-6 h-6 text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">Pending</p>
              <p className="text-lg font-black text-[#0D1526]">{pendingApprovals}</p>
            </div>
          </div>
        </Card>

        {/* Scope Distribution */}
        <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm">
              <Target className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-0.5">In Scope</p>
              <p className="text-lg font-black text-[#0D1526]">{inScopeCount}<span className="text-[#94A3B8] text-sm font-semibold ml-1">/{totalRequests}</span></p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#2563EB]" />
                <h3 className="font-bold text-[#0D1526] text-sm tracking-tight uppercase">Project Progress</h3>
              </div>
              <span className="text-sm font-black text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-[#2563EB] transition-all duration-700 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-4 text-xs font-semibold text-[#64748B]">
              <span>{completedRequests} processed</span>
              <span>{pendingCount} pending</span>
            </div>
          </Card>

          {/* Scope Overview Bars */}
          <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-[#0D1526] text-sm tracking-tight uppercase mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-[#2563EB]" />
              Scope Overview
            </h3>
            <div className="space-y-5">
              {/* In Scope */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">In Scope</span>
                  </div>
                  <span className="text-sm font-black text-[#0D1526]">{inScopeCount}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                  <div className="h-full rounded-full bg-emerald-500 transition-all duration-500 shadow-sm" style={{ width: totalRequests > 0 ? `${(inScopeCount / totalRequests) * 100}%` : '0%' }} />
                </div>
              </div>
              {/* Out of Scope */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Out of Scope</span>
                  </div>
                  <span className="text-sm font-black text-[#0D1526]">{outOfScopeCount}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                  <div className="h-full rounded-full bg-red-500 transition-all duration-500 shadow-sm" style={{ width: totalRequests > 0 ? `${(outOfScopeCount / totalRequests) * 100}%` : '0%' }} />
                </div>
              </div>
              {/* Pending */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Pending / Needs Info</span>
                  </div>
                  <span className="text-sm font-black text-[#0D1526]">{pendingCount}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                  <div className="h-full rounded-full bg-amber-500 transition-all duration-500 shadow-sm" style={{ width: totalRequests > 0 ? `${(pendingCount / totalRequests) * 100}%` : '0%' }} />
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-[#0D1526] text-sm tracking-tight uppercase mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#2563EB]" />
              Recent Activity
            </h3>
            {recentActivity.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[#0D1526] font-semibold text-sm">No activity yet</p>
                <p className="text-[#64748B] text-xs mt-1">Start a conversation with AI to see updates here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item) => {
                  const Icon = item.icon;
                  const colors = colorMap[item.color] || colorMap.slate;
                  return (
                    <div key={item.id} className="flex items-start gap-4 group p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 ${colors}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 mt-0.5">
                        <p className="text-sm text-[#0D1526] font-bold truncate group-hover:text-[#2563EB] transition-colors">{item.title}</p>
                        <p className="text-xs font-medium text-[#64748B] truncate mt-1">{item.description}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider flex-shrink-0 mt-1.5 bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-sm">
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
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-[#0D1526] text-sm tracking-tight uppercase mb-5">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                onClick={() => router.push(`${basePath}/chat`)}
                className="w-full bg-[#2563EB] hover:bg-[#1A56DB] text-white border-0 rounded-xl h-12 text-sm justify-between group shadow-sm"
              >
                <span className="flex items-center gap-2 font-bold">
                  <MessageSquare className="w-4 h-4" />
                  Start AI Chat
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => router.push(`${basePath}/requests`)}
                variant="outline"
                className="w-full border-slate-200 bg-white text-[#0D1526] hover:bg-slate-50 hover:text-[#2563EB] hover:border-blue-200 rounded-xl h-12 text-sm justify-between group shadow-sm transition-all font-bold"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
                  View Requests
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                onClick={() => router.push(`${basePath}/changes`)}
                variant="outline"
                className="w-full border-slate-200 bg-white text-[#0D1526] hover:bg-slate-50 hover:text-[#2563EB] hover:border-blue-200 rounded-xl h-12 text-sm justify-between group shadow-sm transition-all font-bold"
              >
                <span className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#64748B] group-hover:text-[#2563EB] transition-colors" />
                  Change Requests
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>

          {/* Budget Overview */}
          {project.budget > 0 && (
            <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <h3 className="font-bold text-[#0D1526] text-sm tracking-tight uppercase mb-5 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#2563EB]" />
                Budget
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-black text-[#0D1526]">${project.spent.toLocaleString()}</span>
                  <span className="text-sm font-bold text-[#94A3B8]">/ ${project.budget.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-700 shadow-sm ${budgetUsed > 90 ? 'bg-red-500' : budgetUsed > 70 ? 'bg-amber-500' : 'bg-[#2563EB]'}`}
                    style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                  />
                </div>
                <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider">{budgetUsed}% used</p>
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="font-bold text-[#0D1526] text-sm tracking-tight uppercase mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2563EB]" />
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Start Date</span>
                <span className="text-xs text-[#0D1526] font-bold">
                  {project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">End Date</span>
                <span className="text-xs text-[#0D1526] font-bold">
                  {project.end_date ? new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Ongoing'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors border-t border-slate-100">
                <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Duration</span>
                <span className="text-xs text-[#2563EB] font-bold bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  {project.start_date ? formatDistanceToNow(new Date(project.start_date)) : '—'}
                </span>
              </div>
            </div>
          </Card>

          {/* AI Status */}
          <Card className="bg-white border border-[#E2E8F4] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-white to-blue-50/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shadow-blue-500/20 text-white">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0D1526]">ScopeOS AI</h4>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" /> Online
                </p>
              </div>
            </div>
            <p className="text-xs font-medium text-[#64748B] leading-relaxed">
              Your AI assistant is ready to analyze requests, provide scope decisions, and handle change orders automatically.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
