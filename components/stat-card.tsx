import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
}

export function StatCard({ title, value, change, icon: Icon, trend = 'up' }: StatCardProps) {
  return (
    <Card className="glass-card rounded-xl overflow-hidden glow-border-hover transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-white/40 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white">{value}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Icon className="text-blue-400" size={24} />
          </div>
        </div>

        {change !== undefined && (
          <div className={`flex items-center gap-2 text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            <span className="font-semibold">
              {trend === 'up' ? '+' : '−'}{Math.abs(change)}%
            </span>
            <span className="text-white/30">vs last month</span>
          </div>
        )}
      </div>
    </Card>
  );
}
