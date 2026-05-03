'use client';

import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track metrics and insights about your projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="backdrop-blur-sm border-accent/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg Response Time</p>
                <p className="text-2xl font-bold text-foreground">2.4 hrs</p>
              </div>
              <Clock className="text-primary" size={32} />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-sm border-accent/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Approval Rate</p>
                <p className="text-2xl font-bold text-foreground">87%</p>
              </div>
              <TrendingUp className="text-primary" size={32} />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-sm border-accent/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
                <p className="text-2xl font-bold text-foreground">124</p>
              </div>
              <Users className="text-primary" size={32} />
            </div>
          </div>
        </Card>

        <Card className="backdrop-blur-sm border-accent/20">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Scope Creep Saved</p>
                <p className="text-2xl font-bold text-foreground">$18,500</p>
              </div>
              <BarChart3 className="text-primary" size={32} />
            </div>
          </div>
        </Card>
      </div>

      <Card className="backdrop-blur-sm border-accent/20 p-12 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">Analytics Dashboard Coming Soon</h2>
        <p className="text-muted-foreground">Detailed charts and insights will be available here</p>
      </Card>
    </div>
  );
}
