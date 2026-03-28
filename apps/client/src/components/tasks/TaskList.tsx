'use client';

import Link from 'next/link';
import { TaskStatusBadge } from './TaskStatusBadge';
import { ProgressBar } from './ProgressBar';
import type { TaskItem, TaskType } from '@task-processing-engine/shared';

const TYPE_ICONS: Record<TaskType, string> = {
  'file-processing':   '📄',
  'report-generation': '📊',
  'ai-analysis':       '🤖',
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface Props {
  tasks: TaskItem[];
  isLoading?: boolean;
  isError?: boolean;
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  isLoading,
  isError,
  emptyMessage = 'No tasks found.',
}: Props) {
  if (isLoading) {
    return (
      <div className="space-y-2.5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-surface-raised" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-800/50 bg-red-950/30 px-4 py-5">
        <p className="text-sm font-medium text-red-400">Unable to reach server</p>
        <p className="mt-0.5 text-xs text-red-500">
          Make sure the NestJS server is running on port 3001.
        </p>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border px-4 py-12 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-2xl">
          📋
        </div>
        <p className="text-sm font-medium text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task._id}>
          <Link
            href={`/tasks/${task._id}`}
            className="group block rounded-2xl border border-border bg-surface px-4 py-3.5 shadow-sm transition-all hover:border-brand/50 hover:shadow-md hover:shadow-brand/5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-raised text-lg">
                  {TYPE_ICONS[task.type as TaskType] ?? '⚙️'}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold capitalize text-foreground group-hover:text-brand">
                    {task.type.replace(/-/g, ' ')}
                  </p>
                  <p className="text-xs text-muted">{relativeTime(task.createdAt)}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <TaskStatusBadge status={task.status} />
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-muted/40 transition-colors group-hover:text-brand"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>

            {/* Progress bar for active tasks */}
            {task.status === 'processing' && (
              <div className="mt-2.5">
                <ProgressBar value={task.progress} pulse />
              </div>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
