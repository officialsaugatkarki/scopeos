'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIAnalysis } from '@/lib/supabase';
import { CheckCircle2, AlertCircle, HelpCircle, TrendingUp } from 'lucide-react';

interface AIAnalysisCardProps {
  analysis: AIAnalysis;
}

export default function AIAnalysisCard({ analysis }: AIAnalysisCardProps) {
  const getDecisionColor = () => {
    switch (analysis.decision) {
      case 'in-scope': return 'border-emerald-500/20';
      case 'out-of-scope': return 'border-red-500/20';
      case 'needs-info': return 'border-amber-500/20';
      default: return 'border-blue-500/20';
    }
  };

  const getDecisionIcon = () => {
    switch (analysis.decision) {
      case 'in-scope': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'out-of-scope': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'needs-info': return <HelpCircle className="w-5 h-5 text-amber-400" />;
    }
  };

  const getDecisionText = () => {
    switch (analysis.decision) {
      case 'in-scope': return 'In Scope';
      case 'out-of-scope': return 'Out of Scope';
      case 'needs-info': return 'Needs Clarification';
    }
  };

  const getConfidenceColor = () => {
    if (analysis.confidence >= 0.85) return 'text-emerald-400';
    if (analysis.confidence >= 0.70) return 'text-blue-400';
    return 'text-amber-400';
  };

  return (
    <Card className={`glass-card rounded-xl border-2 ${getDecisionColor()}`}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getDecisionIcon()}
            <div>
              <h3 className="font-semibold text-white">AI Decision</h3>
              <p className="text-sm text-white/40">ScopeOS Analysis</p>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1 border-white/10 text-white/70">{getDecisionText()}</Badge>
        </div>

        <div>
          <p className="text-sm font-medium text-white/70 mb-1">Reasoning</p>
          <p className="text-sm text-white/40">{analysis.reasoning}</p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <div className="flex-1">
            <p className="text-xs text-white/30">Confidence Score</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/[0.06] rounded-full h-2">
                <div className={`h-2 rounded-full transition-all ${
                  analysis.confidence >= 0.85 ? 'bg-emerald-500' : analysis.confidence >= 0.70 ? 'bg-blue-500' : 'bg-amber-500'
                }`} style={{ width: `${analysis.confidence * 100}%` }} />
              </div>
              <span className={`text-sm font-semibold ${getConfidenceColor()}`}>{Math.round(analysis.confidence * 100)}%</span>
            </div>
          </div>
        </div>

        {analysis.estimatedHours && (
          <div className="p-3 bg-white/[0.02] rounded-lg border border-white/[0.04]">
            <p className="text-xs text-white/30 mb-1">Estimated Hours</p>
            <p className="text-lg font-semibold text-white">{analysis.estimatedHours}h</p>
          </div>
        )}

        {analysis.suggestedTasks && analysis.suggestedTasks.length > 0 && (
          <div>
            <p className="text-sm font-medium text-white/70 mb-2">Suggested Tasks</p>
            <ul className="space-y-1">
              {analysis.suggestedTasks.map((task, idx) => (
                <li key={idx} className="text-sm text-white/40 flex items-start gap-2">
                  <span className="text-blue-400 mt-0.5">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
