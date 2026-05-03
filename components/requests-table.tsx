'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getChangeRequests } from '@/lib/database';
import type { ChangeRequest } from '@/lib/supabase';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  'in-review': { label: 'In Review', color: 'bg-blue-100 text-blue-800' },
  approved: { label: 'Approved', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
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
      <Card className="backdrop-blur-sm border-accent/20">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Recent Change Requests</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm border-accent/20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Change Requests</h2>
          <button className="flex items-center gap-2 text-primary hover:underline text-sm font-medium">
            View All <ArrowRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Client</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Description</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-muted-foreground">
                    No change requests yet
                  </td>
                </tr>
              ) : (
                requests.map((request) => {
                  const statusInfo = statusConfig[request.status as keyof typeof statusConfig] || 
                    { label: request.status, color: 'bg-gray-100 text-gray-800' };
                  return (
                    <tr key={request.id} className="border-b border-border hover:bg-primary/5 transition-colors">
                      <td className="py-4 px-4 font-medium text-foreground">{request.client}</td>
                      <td className="py-4 px-4 text-foreground">{request.description}</td>
                      <td className="py-4 px-4">
                        <Badge className={`${statusInfo.color}`}>{statusInfo.label}</Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground text-xs">
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
