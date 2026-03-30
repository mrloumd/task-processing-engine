import type { TaskStatus } from '@task-processing-engine/shared';

const STYLES: Record<TaskStatus, string> = {
  pending:    'bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60',
  queued:     'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
  processing: 'bg-brand/10 text-brand border-brand/30',
  completed:  'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50',
  failed:     'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800/50',
  cancelled:  'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-900/60 dark:border-slate-700/40',
};

const DOTS: Record<TaskStatus, string> = {
  pending:    'bg-slate-400',
  queued:     'bg-amber-400',
  processing: 'bg-brand animate-pulse',
  completed:  'bg-emerald-400',
  failed:     'bg-red-400',
  cancelled:  'bg-slate-500',
};

interface Props {
  status: TaskStatus;
}

export function TaskStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STYLES[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${DOTS[status]}`} />
      {status}
    </span>
  );
}
