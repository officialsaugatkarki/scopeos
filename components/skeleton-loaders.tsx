'use client';

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-lg border border-border bg-card animate-pulse">
      <div className="space-y-3">
        <div className="h-6 bg-muted rounded w-2/3" />
        <div className="h-4 bg-muted rounded" />
        <div className="h-4 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-border">
      <td className="py-4 px-4"><div className="h-4 bg-muted rounded w-24 animate-pulse" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-muted rounded w-32 animate-pulse" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-muted rounded w-24 animate-pulse" /></td>
      <td className="py-4 px-4"><div className="h-4 bg-muted rounded w-28 animate-pulse" /></td>
    </tr>
  );
}

export function DashboardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-4 bg-muted rounded w-32 animate-pulse" />
      <div className="h-2 bg-muted rounded overflow-hidden">
        <div 
          className="h-full bg-primary animate-pulse"
          style={{
            animation: 'pulse 2s ease-in-out infinite',
            width: '65%',
          }}
        />
      </div>
    </div>
  );
}

export function RequestAnalysisSkeleton() {
  return (
    <div className="p-6 rounded-lg border border-border bg-card space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="space-y-3">
        <div className="h-4 bg-muted rounded" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="h-4 bg-muted rounded w-4/5" />
      </div>
      <div className="pt-4 border-t border-border">
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}
