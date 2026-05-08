'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface ScopeDecisionBadgeProps {
  decision: 'in-scope' | 'out-of-scope' | 'needs-info';
  size?: 'sm' | 'md' | 'lg';
}

export default function ScopeDecisionBadge({ decision, size = 'md' }: ScopeDecisionBadgeProps) {
  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;

  const config = {
    'in-scope': {
      label: 'In Scope',
      icon: <CheckCircle2 style={{ width: iconSize, height: iconSize }} />,
      className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    },
    'out-of-scope': {
      label: 'Out of Scope',
      icon: <AlertCircle style={{ width: iconSize, height: iconSize }} />,
      className: 'bg-red-500/10 text-red-400 border border-red-500/20',
    },
    'needs-info': {
      label: 'Needs Info',
      icon: <HelpCircle style={{ width: iconSize, height: iconSize }} />,
      className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    },
  };

  const { label, icon, className } = config[decision];

  return (
    <Badge className={`flex items-center gap-1.5 px-3 py-1 ${className}`}>
      {icon}
      <span>{label}</span>
    </Badge>
  );
}
