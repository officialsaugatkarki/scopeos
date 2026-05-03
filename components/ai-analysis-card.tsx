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
      case 'in-scope':
        return 'bg-emerald-50 border-emerald-200';
      case 'out-of-scope':
        return 'bg-red-50 border-red-200';
      case 'needs-info':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getDecisionIcon = () => {
    switch (analysis.decision) {
      case 'in-scope':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'out-of-scope':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'needs-info':
        return <HelpCircle className="w-5 h-5 text-amber-600" />;
    }
  };

  const getDecisionText = () => {
    switch (analysis.decision) {
      case 'in-scope':
        return 'In Scope';
      case 'out-of-scope':
        return 'Out of Scope';
      case 'needs-info':
        return 'Needs Clarification';
    }
  };

  const getConfidenceColor = () => {
    if (analysis.confidence >= 0.85) return 'text-emerald-600';
    if (analysis.confidence >= 0.70) return 'text-blue-600';
    return 'text-amber-600';
  };

  return (
    <Card className={`p-6 border-2 ${getDecisionColor()}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getDecisionIcon()}
            <div>
              <h3 className="font-semibold text-foreground">AI Decision</h3>
              <p className="text-sm text-muted-foreground">ScopeGuard Analysis</p>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {getDecisionText()}
          </Badge>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-1">Reasoning</p>
          <p className="text-sm text-muted-foreground">{analysis.reasoning}</p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-white bg-opacity-50 rounded-lg">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Confidence Score</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    analysis.confidence >= 0.85
                      ? 'bg-emerald-600'
                      : analysis.confidence >= 0.70
                      ? 'bg-blue-600'
                      : 'bg-amber-600'
                  }`}
                  style={{ width: `${analysis.confidence * 100}%` }}
                />
              </div>
              <span className={`text-sm font-semibold ${getConfidenceColor()}`}>
                {Math.round(analysis.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>

        {analysis.estimatedHours && (
          <div className="p-3 bg-white bg-opacity-50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Estimated Hours</p>
            <p className="text-lg font-semibold text-foreground">{analysis.estimatedHours}h</p>
          </div>
        )}

        {analysis.suggestedTasks && analysis.suggestedTasks.length > 0 && (
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Suggested Tasks</p>
            <ul className="space-y-1">
              {analysis.suggestedTasks.map((task, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
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
