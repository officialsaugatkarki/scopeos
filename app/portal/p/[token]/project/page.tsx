'use client';

import { useState, useEffect } from 'react';
import { usePortal } from '@/components/portal-context';
import { getScopeDocument } from '@/lib/database';
import type { ScopeDocument, ScopeDocumentSection } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import {
  FolderOpen,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Target,
  CheckCircle2,
  XCircle,
  FileText,
  Shield,
  ChevronDown,
  ChevronUp,
  Zap,
  Layers,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PortalProjectPage() {
  const { project, requests, changeRequests } = usePortal();
  const [scopeDoc, setScopeDoc] = useState<(ScopeDocument & { sections: ScopeDocumentSection[] }) | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (project) {
      getScopeDocument(project.id).then(doc => setScopeDoc(doc));
    }
  }, [project]);

  if (!project) return null;

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Stats
  const inScopeCount = requests.filter(r => r.ai_analysis?.decision === 'in-scope').length;
  const outOfScopeCount = requests.filter(r => r.ai_analysis?.decision === 'out-of-scope').length;
  const approvedChanges = changeRequests.filter(cr => cr.status === 'approved').length;

  // Parse AI context for display
  const aiContext = project.ai_context || {};

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Project Details</h1>
        <p className="text-sm text-white/40 mt-1">Your source of truth — scope, timeline, and deliverables</p>
      </div>

      {/* Project Overview Card */}
      <Card className="glass-card-strong rounded-xl p-5 md:p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
            <FolderOpen className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white">{project.name}</h2>
            <p className="text-sm text-white/40 mt-1">{project.description || 'No description provided'}</p>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <Users className="w-3.5 h-3.5" />
                {project.client_name}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <Calendar className="w-3.5 h-3.5" />
                Started {project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                project.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                project.status === 'paused' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                'bg-white/[0.06] text-white/40 border border-white/[0.06]'
              }`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-[11px] text-white/30 uppercase tracking-wider">Total Requests</span>
          </div>
          <p className="text-2xl font-bold text-white">{requests.length}</p>
        </Card>
        <Card className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] text-white/30 uppercase tracking-wider">In Scope</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{inScopeCount}</p>
        </Card>
        <Card className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-[11px] text-white/30 uppercase tracking-wider">Out of Scope</span>
          </div>
          <p className="text-2xl font-bold text-red-400">{outOfScopeCount}</p>
        </Card>
        <Card className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] text-white/30 uppercase tracking-wider">Approved Changes</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{approvedChanges}</p>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Timeline */}
          <Card className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              Timeline
            </h3>
            <div className="space-y-4">
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-emerald-500/20 border-2 border-emerald-500" />
                <div className="absolute left-[5px] top-4 w-[2px] h-full bg-white/[0.06]" />
                <div>
                  <p className="text-xs font-medium text-white/70">Project Started</p>
                  <p className="text-xs text-white/30">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}
                  </p>
                </div>
              </div>
              <div className="relative pl-6">
                <div className="absolute left-0 top-1 w-3 h-3 rounded-full bg-blue-500/20 border-2 border-blue-500 animate-pulse" />
                <div className="absolute left-[5px] top-4 w-[2px] h-full bg-white/[0.06]" />
                <div>
                  <p className="text-xs font-medium text-white/70">Current Phase</p>
                  <p className="text-xs text-white/30">
                    Active for {project.start_date ? formatDistanceToNow(new Date(project.start_date)) : '—'}
                  </p>
                </div>
              </div>
              <div className="relative pl-6">
                <div className={`absolute left-0 top-1 w-3 h-3 rounded-full ${project.end_date ? 'bg-white/[0.06] border-2 border-white/20' : 'bg-white/[0.04] border-2 border-white/10 border-dashed'}`} />
                <div>
                  <p className="text-xs font-medium text-white/70">Target Completion</p>
                  <p className="text-xs text-white/30">
                    {project.end_date ? new Date(project.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Ongoing'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Budget */}
          <Card className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              Budget Overview
            </h3>
            {project.budget > 0 ? (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white">${project.spent.toLocaleString()}</span>
                  <span className="text-sm text-white/30">of ${project.budget.toLocaleString()}</span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
                    style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[10px] text-white/30 uppercase">Remaining</p>
                    <p className="text-sm font-bold text-white mt-0.5">${(project.budget - project.spent).toLocaleString()}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[10px] text-white/30 uppercase">Used</p>
                    <p className="text-sm font-bold text-blue-400 mt-0.5">{Math.round((project.spent / project.budget) * 100)}%</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/30">No budget has been set for this project.</p>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Scope Baseline */}
          <Card className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400" />
              Scope Baseline
            </h3>
            {project.scope_baseline ? (
              <div className="text-sm text-white/60 whitespace-pre-wrap leading-relaxed">
                {project.scope_baseline}
              </div>
            ) : (
              <p className="text-sm text-white/30">
                No scope baseline has been defined yet. Your agency will set this up to help AI make accurate scope decisions.
              </p>
            )}
          </Card>

          {/* Scope Document Sections */}
          {scopeDoc && scopeDoc.sections.length > 0 && (
            <Card className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Scope Document
              </h3>
              <div className="space-y-2">
                {scopeDoc.sections.map((section) => {
                  const isOpen = expandedSections.has(section.id);
                  return (
                    <div key={section.id} className="rounded-lg border border-white/[0.04] overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-3 hover:bg-white/[0.02] transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-blue-400 font-mono">{section.section_number}</span>
                          <span className="text-sm text-white/70 font-medium">{section.title}</span>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-white/20" /> : <ChevronDown className="w-4 h-4 text-white/20" />}
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3 text-sm text-white/50 whitespace-pre-wrap leading-relaxed border-t border-white/[0.04] pt-3">
                          {section.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* AI Context / Policies */}
          {Object.keys(aiContext).length > 0 && (
            <Card className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Project Policies
              </h3>
              <div className="space-y-3">
                {Object.entries(aiContext).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                      {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-sm text-white/60">{String(value)}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
