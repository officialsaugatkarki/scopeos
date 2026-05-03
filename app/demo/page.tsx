'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

export default function DemoPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">ScopeGuard AI Demos</h1>
        <p className="text-muted-foreground">Explore realistic AI analysis flows and scope management features</p>
      </div>

      {/* Featured Demo */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-start justify-between mb-6">
          <div>
            <Badge className="bg-primary mb-4">Featured</Badge>
            <h2 className="text-2xl font-bold text-foreground mb-2">AI Analysis Engine Demo</h2>
            <p className="text-muted-foreground max-w-2xl">
              See how ScopeGuard AI analyzes scope requests in real-time with realistic confidence levels, 
              reasoning explanations, and actionable recommendations.
            </p>
          </div>
          <Zap className="w-8 h-8 text-primary flex-shrink-0" />
        </div>
        <Link href="/demo/ai-analysis">
          <Button className="bg-primary hover:bg-primary/90 text-white">
            Launch Demo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </Card>

      {/* Demo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scope Document Demo */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
          <Link href="/demo/scope-document" className="block h-full">
            <div className="space-y-4 h-full flex flex-col">
              <div>
                <Badge variant="outline" className="mb-3">Document Management</Badge>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  Scope Document Viewer
                </h3>
              </div>
              <p className="text-muted-foreground flex-1">
                Interactive scope document viewer showing project deliverables, exclusions, and technical requirements. 
                AI analysis engine references specific sections when making decisions.
              </p>
              <Button variant="ghost" className="justify-start p-0 text-primary hover:text-primary/80">
                View Demo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Link>
        </Card>

        {/* Request Analysis Flow */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="mb-3">Analysis Results</Badge>
              <h3 className="text-xl font-semibold text-foreground">
                Request Analysis Types
              </h3>
            </div>
            <p className="text-muted-foreground">
              See three different analysis decision types:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span className="text-foreground"><strong>In-Scope:</strong> Clear feature matching project baseline</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600 font-bold">✗</span>
                <span className="text-foreground"><strong>Out-of-Scope:</strong> Requires change request generation</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">?</span>
                <span className="text-foreground"><strong>Needs Clarification:</strong> Ambiguous requirements</span>
              </li>
            </ul>
            <Button variant="ghost" className="justify-start p-0 text-primary hover:text-primary/80">
              View in AI Analysis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Features Showcase */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">What You'll See</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: 'AI Loading Animation',
              description: 'Progressive analysis with real-time status updates (2-3 second simulation)',
            },
            {
              title: 'Confidence Scoring',
              description: '85-95% confidence on clear decisions, 40-60% on ambiguous requests',
            },
            {
              title: 'Reasoning Explanation',
              description: 'Detailed reasoning for each decision with baseline references',
            },
            {
              title: 'Action Recommendations',
              description: 'Suggested next steps: create task, generate change request, or ask questions',
            },
            {
              title: 'Acceptance Criteria',
              description: 'AI-generated acceptance criteria for in-scope requests',
            },
            {
              title: 'Cost Impact Analysis',
              description: 'Estimated hours and cost impact for out-of-scope features',
            },
          ].map((feature, idx) => (
            <Card key={idx} className="p-4 hover:bg-muted/50 transition-colors">
              <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Mock Data Summary */}
      <Card className="p-6 bg-muted/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Demo Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Projects
            </p>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-sm text-muted-foreground">Website Rebuild, Mobile App, Dashboard Redesign</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Scope Requests
            </p>
            <p className="text-2xl font-bold text-foreground">4</p>
            <p className="text-sm text-muted-foreground">Mix of in-scope, out-of-scope, and ambiguous</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Analysis Types
            </p>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-sm text-muted-foreground">In-scope, out-of-scope, needs clarification</p>
          </div>
        </div>
      </Card>

      {/* Back to Dashboard */}
      <div className="flex gap-3">
        <Link href="/dashboard" className="flex-1">
          <Button variant="outline" className="w-full">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
