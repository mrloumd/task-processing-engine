'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTask, useRetryTask, useCancelTask } from '@/hooks/useTasks';
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge';
import { ProgressBar } from '@/components/tasks/ProgressBar';
import { ActivityLog } from '@/components/tasks/ActivityLog';
import type { TaskStatus, TaskType } from '@task-processing-engine/shared';
import { TERMINAL_STATUSES } from '@task-processing-engine/shared';

interface Props {
  params: Promise<{ id: string }>;
}

const TYPE_ICONS: Record<TaskType, string> = {
  'file-processing':   '📄',
  'report-generation': '📊',
  'ai-analysis':       '🤖',
};

// ─── Status Stepper ───────────────────────────────────────────────────────────

const STEPS: { key: TaskStatus; label: string }[] = [
  { key: 'pending',    label: 'Created' },
  { key: 'queued',     label: 'Queued' },
  { key: 'processing', label: 'Processing' },
  { key: 'completed',  label: 'Done' },
];

function StatusStepper({ status }: { status: TaskStatus }) {
  const isFailed    = status === 'failed';
  const isCancelled = status === 'cancelled';

  const activeIndex = (() => {
    if (isFailed || isCancelled) return 2;
    return STEPS.findIndex((s) => s.key === status);
  })();

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const isCompleted = i < activeIndex;
        const isCurrent = i === activeIndex && !isFailed && !isCancelled;
        const isTerminalStep = i === activeIndex && (isFailed || isCancelled);

        const circleStyle = isTerminalStep
          ? isFailed
            ? 'border-red-400 bg-red-950/40 text-red-400'
            : 'border-slate-600 bg-slate-900/60 text-slate-400'
          : isCompleted
          ? 'border-brand bg-brand text-white'
          : isCurrent
          ? 'border-brand bg-brand/10 text-brand'
          : 'border-border bg-surface-raised text-muted';

        const labelStyle = isCompleted || isCurrent
          ? 'text-brand font-medium'
          : isTerminalStep
          ? isFailed ? 'text-red-400' : 'text-slate-500'
          : 'text-muted';

        const lineStyle = isCompleted ? 'bg-brand' : isFailed && i === 1 ? 'bg-red-900' : 'bg-border';

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all ${circleStyle}`}>
                {isTerminalStep ? (isFailed ? '✕' : '—') : isCompleted ? '✓' : i + 1}
              </div>
              <span className={`mt-1 text-[10px] ${labelStyle}`}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mb-4 h-0.5 w-10 sm:w-16 ${lineStyle}`} />
            )}
          </div>
        );
      })}

      {/* Extra terminal badge */}
      {(isFailed || isCancelled) && (
        <div className="flex items-center">
          <div className={`mb-4 h-0.5 w-10 sm:w-16 ${isFailed ? 'bg-red-900' : 'bg-border'}`} />
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold ${isFailed ? 'border-red-400 bg-red-950/40 text-red-400' : 'border-slate-600 bg-slate-900 text-slate-400'}`}>
              {isFailed ? '✕' : '○'}
            </div>
            <span className={`mt-1 text-[10px] font-medium ${isFailed ? 'text-red-400' : 'text-slate-500'}`}>
              {isFailed ? 'Failed' : 'Cancelled'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-4">
      <dt className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="min-w-0 text-sm text-foreground">{children}</dd>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TaskDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: task, isLoading, isError } = useTask(id);
  const { mutate: retryTask, isPending: retrying } = useRetryTask();
  const { mutate: cancelTask, isPending: cancelling } = useCancelTask();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-28 animate-pulse rounded-lg bg-surface-raised" />
        <div className="h-80 animate-pulse rounded-2xl bg-surface-raised" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="space-y-4">
        <Link href="/tasks" className="inline-flex items-center gap-1.5 text-sm text-brand hover:underline">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>
          Back to tasks
        </Link>
        <div className="rounded-2xl border border-red-800/50 bg-red-950/30 p-5">
          <p className="text-sm font-medium text-red-400">Task not found or failed to load.</p>
        </div>
      </div>
    );
  }

  const isTerminal = TERMINAL_STATUSES.includes(task.status);
  const canRetry   = task.status === 'failed';
  const canCancel  = task.status === 'pending' || task.status === 'queued';

  let parsedResult: unknown = null;
  try { if (task.result) parsedResult = JSON.parse(task.result); }
  catch { parsedResult = task.result; }

  return (
    <div className="space-y-6">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link href="/tasks" className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>
          All Tasks
        </Link>
        {!isTerminal && (
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            Polling every 2s
          </span>
        )}
      </div>

      {/* Card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

        {/* Header */}
        <div className="border-b border-border bg-surface-raised/50 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-raised text-2xl ring-1 ring-border">
                {TYPE_ICONS[task.type as TaskType] ?? '⚙️'}
              </span>
              <div>
                <h1 className="text-lg font-bold capitalize text-foreground">
                  {task.type.replace(/-/g, ' ')} Task
                </h1>
                <p className="font-mono text-[11px] text-muted">{task._id}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TaskStatusBadge status={task.status} />

              {canRetry && (
                <button
                  onClick={() => retryTask(task._id)}
                  disabled={retrying}
                  className="rounded-lg border border-amber-800/50 bg-amber-950/30 px-3 py-1.5 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-950/50 disabled:opacity-50"
                >
                  {retrying ? 'Retrying…' : '↺ Retry'}
                </button>
              )}

              {canCancel && (
                <button
                  onClick={() => cancelTask(task._id)}
                  disabled={cancelling}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-red-800/50 hover:text-red-400 disabled:opacity-50"
                >
                  {cancelling ? 'Cancelling…' : '✕ Cancel'}
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {(task.status === 'processing' || (task.status === 'completed' && task.progress > 0)) && (
            <div className="mt-4">
              <ProgressBar value={task.progress} showLabel pulse={task.status === 'processing'} />
            </div>
          )}
        </div>

        {/* Stepper */}
        <div className="flex justify-center overflow-x-auto border-b border-border px-6 py-6">
          <StatusStepper status={task.status} />
        </div>

        {/* Details */}
        <dl className="divide-y divide-border px-6">
          <Row label="status">
            <span className="capitalize">{task.status}</span>
            {task.retry_count > 0 && (
              <span className="ml-2 text-xs text-amber-400">(retry_count: {task.retry_count})</span>
            )}
          </Row>
          <Row label="created_at">{new Date(task.created_at).toLocaleString()}</Row>
          <Row label="updated_at">{new Date(task.updated_at).toLocaleString()}</Row>
          {task.started_at && <Row label="started_at">{new Date(task.started_at).toLocaleString()}</Row>}
          {task.completed_at && <Row label="completed_at">{new Date(task.completed_at).toLocaleString()}</Row>}

          {Object.keys(task.payload).length > 0 && (
            <Row label="payload">
              <pre className="whitespace-pre-wrap break-all rounded-lg bg-surface-raised px-3 py-2 font-mono text-xs text-muted">
                {JSON.stringify(task.payload, null, 2)}
              </pre>
            </Row>
          )}

          {task.status === 'completed' && parsedResult !== null && (
            <Row label="result">
              <div className="rounded-xl border border-emerald-800/50 bg-emerald-950/30 px-3 py-2.5">
                <pre className="whitespace-pre-wrap break-all font-mono text-xs text-emerald-400">
                  {JSON.stringify(parsedResult, null, 2)}
                </pre>
              </div>
            </Row>
          )}

          {task.status === 'failed' && task.error && (
            <Row label="error">
              <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-3 py-2.5">
                <p className="text-xs text-red-400">{task.error}</p>
              </div>
            </Row>
          )}
        </dl>

        {/* Activity log */}
        {task.activity_log?.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">
              Activity Log
            </p>
            <ActivityLog entries={task.activity_log} />
          </div>
        )}

      </div>
    </div>
  );
}
