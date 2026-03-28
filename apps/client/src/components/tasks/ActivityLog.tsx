import type { ActivityLogEntry } from '@task-processing-engine/shared';

const EVENT_STYLES: Record<string, { dot: string; label: string }> = {
  created:            { dot: 'bg-muted',          label: 'Created' },
  queued:             { dot: 'bg-amber-400',       label: 'Queued' },
  processing_started: { dot: 'bg-brand animate-pulse', label: 'Processing started' },
  progress:           { dot: 'bg-brand/60',        label: 'Progress' },
  completed:          { dot: 'bg-emerald-400',     label: 'Completed' },
  failed:             { dot: 'bg-red-400',         label: 'Failed' },
  cancelled:          { dot: 'bg-slate-400',       label: 'Cancelled' },
  retry_requested:    { dot: 'bg-amber-400',       label: 'Retry requested' },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

interface Props {
  entries: ActivityLogEntry[];
}

export function ActivityLog({ entries }: Props) {
  if (!entries.length) {
    return <p className="text-xs text-muted">No activity yet.</p>;
  }

  return (
    <ol className="relative space-y-0">
      {[...entries].reverse().map((entry, i) => {
        const style = EVENT_STYLES[entry.event] ?? {
          dot: 'bg-muted',
          label: entry.event,
        };

        return (
          <li key={i} className="flex gap-3 pb-4 last:pb-0">
            {/* Timeline line + dot */}
            <div className="relative flex flex-col items-center">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${style.dot}`} />
              {i < entries.length - 1 && (
                <div className="mt-1 w-px flex-1 bg-border" />
              )}
            </div>

            {/* Content */}
            <div className="min-w-0 pb-1">
              <p className="text-xs font-medium capitalize text-foreground">
                {style.label}
              </p>
              {entry.detail && (
                <p className="mt-0.5 text-xs text-muted">{entry.detail}</p>
              )}
              <p className="mt-0.5 text-[10px] text-muted/50">
                {relativeTime(entry.timestamp)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
