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
    <Card className="backdrop-blur-sm border-accent/20 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="text-primary" size={24} />
          </div>
        </div>

        {change !== undefined && (
          <div className={`flex items-center gap-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-destructive'}`}>
            <span className={`font-semibold ${trend === 'up' ? '' : ''}`}>
              {trend === 'up' ? '+' : '−'}{Math.abs(change)}%
            </span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        )}
      </div>
    </Card>
  );
}
