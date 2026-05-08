'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getChangeRequests } from '@/lib/database';
import type { ChangeRequest } from '@/lib/supabase';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  'in-review': { label: 'In Review', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
  approved: { label: 'Approved', color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  rejected: { label: 'Rejected', color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
};

export function RequestsTable() {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getChangeRequests();
      setRequests(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <Card className="glass-card rounded-xl">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Recent Change Requests</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-white/[0.03] rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card rounded-xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Change Requests</h2>
          <button className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 px-4 font-semibold text-white/30 text-xs uppercase tracking-wider">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-white/30 text-xs uppercase tracking-wider">Description</th>
                <th className="text-left py-3 px-4 font-semibold text-white/30 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-white/30 text-xs uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-white/30">No change requests yet</td>
                </tr>
              ) : (
                requests.map((request) => {
                  const statusInfo = statusConfig[request.status as keyof typeof statusConfig] || 
                    { label: request.status, color: 'bg-white/5 text-white/50' };
                  return (
                    <tr key={request.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-4 font-medium text-white/80">{request.client}</td>
                      <td className="py-4 px-4 text-white/50">{request.description}</td>
                      <td className="py-4 px-4">
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                      </td>
                      <td className="py-4 px-4 text-white/30 text-xs">
                        {new Date(request.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
