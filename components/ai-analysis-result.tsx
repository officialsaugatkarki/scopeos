'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, HelpCircle, Zap } from 'lucide-react';
import { AIAnalysis } from '@/lib/supabase';

interface AIAnalysisResultProps {
  analysis: AIAnalysis;
}

export function AIAnalysisResult({ analysis }: AIAnalysisResultProps) {
  const decisionIcon = {
    'in-scope': <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
    'out-of-scope': <AlertCircle className="w-6 h-6 text-amber-500" />,
    'needs-info': <HelpCircle className="w-6 h-6 text-blue-500" />,
  };

  const decisionLabel = {
    'in-scope': 'In Scope',
    'out-of-scope': 'Out of Scope',
    'needs-info': 'Needs Clarification',
  };

  const decisionColor = {
    'in-scope': 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    'out-of-scope': 'bg-amber-500/10 text-amber-700 border-amber-200',
    'needs-info': 'bg-blue-500/10 text-blue-700 border-blue-200',
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Decision Header */}
      <Card className={`p-6 border-2 ${decisionColor[analysis.decision]}`}>
        <div className="flex items-start gap-4">
          {decisionIcon[analysis.decision]}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold">{decisionLabel[analysis.decision]}</h3>
              <Badge className={analysis.decision === 'in-scope' ? 'bg-emerald-500' : analysis.decision === 'out-of-scope' ? 'bg-amber-500' : 'bg-blue-500'}>
                {Math.round(analysis.confidence * 100)}% confident
              </Badge>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden max-w-xs">
              <div
                className={`h-full ${
                  analysis.decision === 'in-scope'
                    ? 'bg-emerald-500'
                    : analysis.decision === 'out-of-scope'
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${analysis.confidence * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Reasoning */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-foreground mb-4">AI Analysis</h4>
        <div className="space-y-2">
          {analysis.reasoning.map((reason, idx) => (
            <div key={idx} className="flex gap-3 text-sm">
              <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-muted-foreground">{reason}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Baseline Reference */}
      {analysis.baselineReference && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h4 className="text-lg font-semibold text-foreground mb-3">Scope Baseline Reference</h4>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                Section {analysis.baselineReference.section}
              </p>
              <p className="text-sm text-foreground mt-1 font-medium">
                {analysis.baselineReference.text}
              </p>
            </div>
            {analysis.baselineReference.note && (
              <p className="text-sm text-muted-foreground italic">Note: {analysis.baselineReference.note}</p>
            )}
          </div>
        </Card>
      )}

      {/* In-Scope Tasks */}
      {analysis.decision === 'in-scope' && analysis.acceptanceCriteria && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">Acceptance Criteria</h4>
          <ul className="space-y-2">
            {analysis.acceptanceCriteria.map((criterion, idx) => (
              <li key={idx} className="flex gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{criterion}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Clarification Questions */}
      {analysis.decision === 'needs-info' && analysis.questions && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">Questions for Clarification</h4>
          <div className="space-y-4">
            {analysis.questions.map((item, idx) => (
              <div key={idx} className="pb-4 border-b last:border-b-0 last:pb-0">
                <p className="font-medium text-foreground mb-2">{idx + 1}. {item.question}</p>
                <p className="text-sm text-muted-foreground italic">{item.context}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Out-of-Scope Change Request Draft */}
      {analysis.decision === 'out-of-scope' && analysis.changeRequestDraft && (
        <Card className="p-6 border-amber-200 bg-amber-50/30">
          <h4 className="text-lg font-semibold text-foreground mb-4">Generated Change Request</h4>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</p>
              <p className="text-sm font-medium text-foreground mt-1">{analysis.changeRequestDraft.title}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Summary</p>
              <p className="text-sm text-foreground mt-1">{analysis.changeRequestDraft.summary}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Impact Analysis</p>
              <p className="text-sm text-foreground mt-1">{analysis.changeRequestDraft.impactAnalysis}</p>
            </div>
            {analysis.changeRequestDraft.acceptanceCriteria.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Acceptance Criteria</p>
                <ul className="space-y-1 mt-2">
                  {analysis.changeRequestDraft.acceptanceCriteria.map((criterion, idx) => (
                    <li key={idx} className="text-sm text-foreground flex gap-2">
                      <span className="text-primary">•</span>
                      {criterion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Estimated Hours and Cost */}
      <div className="grid grid-cols-2 gap-4">
        {analysis.estimatedHours && (
          <Card className="p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Estimated Hours
            </p>
            <p className="text-2xl font-bold text-foreground">{analysis.estimatedHours}</p>
          </Card>
        )}
        {analysis.costImpact && (
          <Card className="p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Cost Impact
            </p>
            <p className="text-2xl font-bold text-amber-600">{analysis.costImpact}</p>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        {analysis.decision === 'in-scope' && (
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        )}
        {analysis.decision === 'out-of-scope' && (
          <Button className="flex-1 bg-amber-600 hover:bg-amber-700">
            <AlertCircle className="w-4 h-4 mr-2" />
            Send Change Request
          </Button>
        )}
        {analysis.decision === 'needs-info' && (
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            <HelpCircle className="w-4 h-4 mr-2" />
            Send Questions to Client
          </Button>
        )}
        <Button variant="outline" className="flex-1">
          Review & Edit
        </Button>
      </div>
    </div>
  );
}
