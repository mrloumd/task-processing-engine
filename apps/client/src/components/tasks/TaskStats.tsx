'use client';

import { useMetrics } from '@/hooks/useTasks';

const CARDS = [
  { key: 'total',      label: 'Total',      color: 'text-foreground',                                     bg: 'bg-surface',                                         border: 'border-border' },
  { key: 'queued',     label: 'Queued',     color: 'text-amber-700 dark:text-amber-400',                  bg: 'bg-amber-50 dark:bg-amber-950/30',                   border: 'border-amber-200 dark:border-amber-800/50' },
  { key: 'processing', label: 'Processing', color: 'text-brand',                                          bg: 'bg-brand/5',                                         border: 'border-brand/30' },
  { key: 'completed',  label: 'Completed',  color: 'text-emerald-700 dark:text-emerald-400',              bg: 'bg-emerald-50 dark:bg-emerald-950/30',               border: 'border-emerald-200 dark:border-emerald-800/50' },
  { key: 'failed',     label: 'Failed',     color: 'text-red-700 dark:text-red-400',                      bg: 'bg-red-50 dark:bg-red-950/30',                       border: 'border-red-200 dark:border-red-800/50' },
  { key: 'cancelled',  label: 'Cancelled',  color: 'text-slate-500',                                      bg: 'bg-slate-100 dark:bg-slate-900/40',                  border: 'border-slate-200 dark:border-slate-700/40' },
] as const;

export function TaskStats() {
  const { data: metrics, isLoading } = useMetrics();

  const getValue = (key: string): number => {
    if (!metrics) return 0;
    if (key === 'total') return metrics.total;
    return (metrics.byStatus as Record<string, number>)[key] ?? 0;
  };

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {CARDS.map(({ key, label, color, bg, border }) => (
        <div key={key} className={`rounded-xl border ${border} ${bg} px-3 py-3`}>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted">{label}</p>
          <p className={`mt-1 text-2xl font-bold tabular-nums ${color}`}>
            {isLoading ? (
              <span className="inline-block h-7 w-8 animate-pulse rounded bg-surface-raised" />
            ) : (
              getValue(key)
            )}
          </p>
        </div>
      ))}
    </div>
  );
}
