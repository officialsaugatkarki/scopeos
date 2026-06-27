'use client';

import { Badge } from '@/components/ui/badge';
import { ArrowRight, Inbox } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getRequests } from '@/lib/database';
import type { Request } from '@/lib/supabase';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-600 border border-amber-200' },
  'in-review': { label: 'In Review', color: 'bg-blue-50 text-[#2563EB] border border-blue-200' },
  approved: { label: 'Approved', color: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  rejected: { label: 'Rejected', color: 'bg-red-50 text-red-600 border border-red-200' },
};

export function RequestsTable() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getRequests();
      setRequests(data.filter(r => r.ai_decision === 'out-of-scope'));
      setIsLoading(false);
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-0">
        <div className="p-6 border-b border-[#E2E8F4] bg-slate-50/50">
          <h2 className="text-sm font-bold text-[#0D1526] uppercase tracking-wider">Change Requests</h2>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-slate-50 border border-slate-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 h-full flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-[#E2E8F4] bg-slate-50/50">
        <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-widest">Change Requests</h2>
        <button onClick={() => window.location.href = '/dashboard/requests'} className="flex items-center gap-1.5 text-[#2563EB] hover:text-[#1A56DB] text-[10px] font-bold uppercase tracking-wider transition-colors bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-full">
          View All <ArrowRight size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                    <Inbox className="w-5 h-5 text-[#94A3B8]" />
                  </div>
                  <p className="text-[#64748B] font-medium text-sm">No change requests</p>
                </td>
              </tr>
            ) : (
              requests.map((request) => {
                const statusInfo = statusConfig[request.status as keyof typeof statusConfig] || 
                  { label: request.status, color: 'bg-slate-100 text-[#64748B] border border-slate-200' };
                return (
                  <tr key={request.id} className="border-b border-[#E2E8F4] hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => window.location.href = `/dashboard/requests/${request.id}`}>
                    <td className="py-4 px-5">
                      <p className="font-semibold text-[#0D1526] group-hover:text-[#2563EB] transition-colors line-clamp-2 leading-snug mb-2 text-sm">{request.message}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                          {request.client_id.substring(0, 8)}
                        </span>
                        <span className="text-xs font-medium text-[#94A3B8]">
                          {new Date(request.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        <Badge className={`${statusInfo.color} text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ml-auto`}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
