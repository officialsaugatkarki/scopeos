'use client';

import { Card } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Analytics</h1>
        <p className="text-white/60 font-medium">Track metrics and insights about your projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/[0.02] border border-white/[0.06] rounded-2xl shadow-sm hover:bg-white/[0.04] transition-colors">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1 font-medium">Avg Response Time</p>
                <p className="text-2xl font-bold text-white">2.4 hrs</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Clock className="text-blue-400" size={24} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white/[0.02] border border-white/[0.06] rounded-2xl shadow-sm hover:bg-white/[0.04] transition-colors">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1 font-medium">Approval Rate</p>
                <p className="text-2xl font-bold text-white">87%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="text-emerald-400" size={24} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white/[0.02] border border-white/[0.06] rounded-2xl shadow-sm hover:bg-white/[0.04] transition-colors">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1 font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-white">124</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Users className="text-purple-400" size={24} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white/[0.02] border border-white/[0.06] rounded-2xl shadow-sm hover:bg-white/[0.04] transition-colors">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60 mb-1 font-medium">Scope Creep Saved</p>
                <p className="text-2xl font-bold text-emerald-400">$18,500</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <BarChart3 className="text-blue-400" size={24} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-16 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-6 h-6 text-white/40" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Analytics Dashboard Coming Soon</h2>
        <p className="text-white/60 max-w-sm mx-auto">Detailed charts and insights about your team's performance will be available here.</p>
      </Card>
    </div>
  );
}
