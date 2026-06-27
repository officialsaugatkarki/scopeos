import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean | null;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <Card className="bg-white border border-[#E2E8F4] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-[#64748B] mb-2 uppercase tracking-wider">{title}</p>
            <h3 className="text-3xl font-black text-[#0D1526]">{value}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Icon className="text-[#2563EB]" size={24} />
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center gap-1.5 mt-2">
            {trendUp === true && <TrendingUp size={14} className="text-emerald-500" />}
            {trendUp === false && <TrendingDown size={14} className="text-amber-500" />}
            {trendUp === null && <Minus size={14} className="text-slate-400" />}
            
            <span className={`text-xs font-medium ${
              trendUp === true ? 'text-emerald-600' : 
              trendUp === false ? 'text-amber-600' : 'text-slate-500'
            }`}>
              {trend}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
