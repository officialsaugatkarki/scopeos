'use client';

import { useState, useMemo } from 'react';
import { usePortal } from '@/components/portal-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

type FilterStatus = 'all' | 'in-scope' | 'out-of-scope' | 'needs-info' | 'pending' | 'completed';

export default function PortalRequestsPage() {
  const { requests, token } = usePortal();
  const router = useRouter();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const basePath = `/portal/p/${token}`;

  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(r => {
        const decision = r.ai_decision;
        if (filter === 'pending') return !decision || r.status === 'submitted' || r.status === 'pending' || r.status === 'analyzed';
        if (filter === 'completed') return r.status === 'completed' || r.status === 'approved' || r.status === 'rejected';
        return decision === filter;
      });
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.message.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [requests, filter, searchQuery]);

  const filterOptions: { value: FilterStatus; label: string; count: number; color: string }[] = [
    { value: 'all', label: 'All', count: requests.length, color: 'text-white/60' },
    { value: 'in-scope', label: 'In Scope', count: requests.filter(r => r.ai_decision === 'in-scope').length, color: 'text-emerald-400' },
    { value: 'out-of-scope', label: 'Out of Scope', count: requests.filter(r => r.ai_decision === 'out-of-scope').length, color: 'text-red-400' },
    { value: 'needs-info', label: 'Needs Info', count: requests.filter(r => r.ai_decision === 'needs-info').length, color: 'text-amber-400' },
    { value: 'pending', label: 'Pending', count: requests.filter(r => !r.ai_decision || r.status === 'pending' || r.status === 'analyzed').length, color: 'text-blue-400' },
  ];

  const getDecisionIcon = (decision?: string) => {
    switch (decision) {
      case 'in-scope': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'out-of-scope': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'needs-info': return <HelpCircle className="w-4 h-4 text-amber-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getDecisionBadge = (decision?: string) => {
    switch (decision) {
      case 'in-scope': return <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">In Scope</span>;
      case 'out-of-scope': return <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium">Out of Scope</span>;
      case 'needs-info': return <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Needs Info</span>;
      default: return <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">Pending Review</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">Completed</span>;
      case 'approved': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">Approved</span>;
      case 'rejected': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/15">Rejected</span>;
      case 'analyzed': return <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/15">Analyzed</span>;
      default: return <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 border border-white/[0.06]">Pending</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Requests</h1>
          <p className="text-sm text-white/40 mt-1">Track all your scope requests and AI decisions</p>
        </div>
        <Button
          onClick={() => router.push(`${basePath}/chat`)}
          className="btn-gradient text-white border-0 rounded-xl h-10 text-sm"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          New Request via Chat
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full dark-input rounded-xl pl-10 pr-4 py-2.5 text-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-white/30 flex-shrink-0" />
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                filter === opt.value
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60'
              }`}
            >
              {opt.label}
              <span className={`${filter === opt.value ? 'text-blue-400/60' : 'text-white/20'}`}>
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredRequests.length === 0 ? (
        <Card className="glass-card rounded-xl p-6 md:p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-white/60 mb-2">
            {searchQuery ? 'No requests found' : filter !== 'all' ? 'No requests in this category' : 'No requests yet'}
          </h3>
          <p className="text-sm text-white/30 mb-6">
            {searchQuery ? 'Try adjusting your search terms' : 'Start a conversation with AI to create your first request'}
          </p>
          {!searchQuery && (
            <Button onClick={() => router.push(`${basePath}/chat`)} className="btn-gradient text-white border-0 rounded-xl">
              Start AI Chat
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => {
            const decision = request.ai_decision;
            const isExpanded = expandedId === request.id;

            // Generate title from message
            const title = request.message.substring(0, 60) + (request.message.length > 60 ? '...' : '');

            return (
              <Card
                key={request.id}
                className={`glass-card rounded-xl overflow-hidden transition-all duration-200 cursor-pointer hover:border-white/10 ${
                  decision === 'in-scope' ? 'border-l-4 border-l-emerald-500/40' :
                  decision === 'out-of-scope' ? 'border-l-4 border-l-red-500/40' :
                  decision === 'needs-info' ? 'border-l-4 border-l-amber-500/40' :
                  'border-l-4 border-l-blue-500/40'
                }`}
                onClick={() => setExpandedId(isExpanded ? null : request.id)}
              >
                {/* Header Row */}
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      {getDecisionIcon(decision)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="font-semibold text-white text-sm truncate">{title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getDecisionBadge(decision)}
                          <button className="text-white/20 hover:text-white/40 transition-colors">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-white/40 line-clamp-1">{request.message}</p>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-[11px] text-white/30">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                        </span>
                        {request.estimated_impact && decision === 'out-of-scope' && (
                          <span className="flex items-center gap-1 text-[11px] text-amber-400/60">
                            <DollarSign className="w-3 h-3" />
                            Est: {request.estimated_impact}
                          </span>
                        )}
                        {getStatusBadge(request.status)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0 space-y-3 border-t border-white/[0.04]">
                    <div className="pt-3">
                      <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Message</h4>
                      <p className="text-sm text-white/60 whitespace-pre-wrap">{request.message}</p>
                    </div>

                    {decision && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-medium text-white/50 uppercase tracking-wider">AI Analysis</h4>
                        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-2">
                          {request.reasoning && (
                            <div>
                              <p className="text-xs text-white/30 mb-1">Reasoning</p>
                              <p className="text-sm text-white/60">
                                {request.reasoning}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center gap-4 flex-wrap mt-2">
                            {request.confidence_score !== undefined && (
                              <div>
                                <p className="text-xs text-white/30 mb-0.5">Confidence</p>
                                <p className="text-sm text-white/70 font-medium">{Math.round(request.confidence_score)}%</p>
                              </div>
                            )}
                            {request.estimated_impact && decision === 'out-of-scope' && (
                              <div>
                                <p className="text-xs text-white/30 mb-0.5">Cost Impact</p>
                                <p className="text-sm text-amber-400 font-medium">{request.estimated_impact}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
