'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateTask, useTasks } from '@/hooks/useTasks';
import { TaskStatusBadge } from '@/components/tasks/TaskStatusBadge';
import { ProgressBar } from '@/components/tasks/ProgressBar';
import type { TaskType } from '@task-processing-engine/shared';
import { TASK_TYPES } from '@task-processing-engine/shared';

const TYPE_META: Record<TaskType, { icon: string; label: string; description: string; payloadField?: { name: string; label: string; placeholder: string } }> = {
  'file-processing': {
    icon: '📄',
    label: 'File Processing',
    description: 'Parse and extract structured data from files. Simulates multi-stage I/O processing.',
    payloadField: { name: 'fileName', label: 'File name', placeholder: 'e.g. report-2024.pdf' },
  },
  'report-generation': {
    icon: '📊',
    label: 'Report Generation',
    description: 'Aggregate data and build formatted PDF reports with charts and tables.',
    payloadField: { name: 'reportType', label: 'Report type', placeholder: 'e.g. summary, detailed, executive' },
  },
  'ai-analysis': {
    icon: '🤖',
    label: 'AI Analysis',
    description: 'Run NLP inference to extract sentiment, categories, and key insights from text.',
    payloadField: { name: 'input', label: 'Input text', placeholder: 'e.g. Q3 performance was strong…' },
  },
};

const TYPE_ICONS: Record<TaskType, string> = {
  'file-processing':   '📄',
  'report-generation': '📊',
  'ai-analysis':       '🤖',
};

const STATUS_CONFIG: Record<string, { dot: string; border: string; label: string }> = {
  pending:    { dot: 'bg-slate-400',          border: 'border-l-slate-500',   label: 'Pending' },
  queued:     { dot: 'bg-amber-400',          border: 'border-l-amber-500',   label: 'Queued' },
  processing: { dot: 'bg-brand animate-pulse', border: 'border-l-brand',      label: 'Processing' },
  completed:  { dot: 'bg-emerald-400',        border: 'border-l-emerald-500', label: 'Completed' },
  failed:     { dot: 'bg-red-400',            border: 'border-l-red-500',     label: 'Failed' },
  cancelled:  { dot: 'bg-slate-600',          border: 'border-l-slate-600',   label: 'Cancelled' },
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

// ─── Queue Visualizer ─────────────────────────────────────────────────────────

function QueueVisualizer() {
  const { data, isLoading } = useTasks({ limit: 20 }, 2000);
  const tasks = data?.tasks ?? [];

  const counts = tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-raised" />
        ))}
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center">
        <p className="text-sm text-muted">No tasks yet. Submit one above to see the queue.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) =>
          counts[status] ? (
            <span
              key={status}
              className="flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-[11px] font-medium text-foreground"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
              <span className="text-muted">×{counts[status]}</span>
            </span>
          ) : null
        )}
      </div>

      <ul className="space-y-1.5">
        {tasks.map((task) => {
          const cfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.pending;
          return (
            <li key={task._id}>
              <Link
                href={`/tasks/${task._id}`}
                className={`group flex items-center gap-3 rounded-xl border border-border border-l-2 bg-surface px-4 py-3 transition-all hover:border-brand/40 hover:shadow-sm ${cfg.border}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-raised text-base">
                  {TYPE_ICONS[task.type as TaskType] ?? '⚙️'}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium capitalize text-foreground group-hover:text-brand">
                      {task.type.replace(/-/g, ' ')}
                    </p>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      <span className="text-[11px] font-medium text-muted">{cfg.label}</span>
                    </div>
                  </div>

                  {task.status === 'processing' ? (
                    <div className="mt-1.5">
                      <ProgressBar value={task.progress} pulse />
                    </div>
                  ) : (
                    <p className="mt-0.5 text-[11px] text-muted">{relativeTime(task.created_at)}</p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Mode = 'single' | 'queue';

export default function CreateTaskPage() {
  const router = useRouter();
  const { mutateAsync: createTask, isPending, isError, error } = useCreateTask();

  const [mode, setMode] = useState<Mode>('single');
  const [selectedType, setSelectedType] = useState<TaskType>('file-processing');
  const [payloadValue, setPayloadValue] = useState('');
  const [queuedCount, setQueuedCount] = useState(0);

  const meta = TYPE_META[selectedType];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, unknown> = {};
    if (meta.payloadField && payloadValue.trim()) {
      payload[meta.payloadField.name] = payloadValue.trim();
    }
    const task = await createTask({ type: selectedType, payload });

    if (mode === 'single') {
      router.push(`/tasks/${task._id}`);
    } else {
      setQueuedCount((n) => n + 1);
      setPayloadValue('');
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-10 pt-24 space-y-6">

      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to dashboard
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Create a Task</h1>
          <p className="mt-0.5 text-sm text-muted">Choose a task type and submit it to the processing queue.</p>
        </div>

        {/* Mode toggle */}
        <div className="flex shrink-0 rounded-xl border border-border bg-surface-raised p-1">
          <button
            onClick={() => setMode('single')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              mode === 'single'
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Single
          </button>
          <button
            onClick={() => setMode('queue')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              mode === 'queue'
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            Queue
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Type selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">
            Task Type
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            {TASK_TYPES.map((t) => {
              const m = TYPE_META[t];
              const isSelected = selectedType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setSelectedType(t); setPayloadValue(''); }}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-brand bg-brand/10 shadow-sm shadow-brand/10'
                      : 'border-border bg-surface-raised hover:border-brand/40 hover:bg-brand/5'
                  }`}
                >
                  <span className="mb-2 block text-2xl">{m.icon}</span>
                  <p className={`text-sm font-semibold ${isSelected ? 'text-brand' : 'text-foreground'}`}>
                    {m.label}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">{m.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payload field */}
        {meta.payloadField && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">
              {meta.payloadField.label}{' '}
              <span className="normal-case font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={payloadValue}
              onChange={(e) => setPayloadValue(e.target.value)}
              placeholder={meta.payloadField.placeholder}
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-brand/50 focus:outline-none"
            />
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 dark:border-red-800/50 dark:bg-red-950/30">
            <p className="text-sm text-red-700 dark:text-red-400">
              {error instanceof Error ? error.message : 'Failed to create task. Is the server running?'}
            </p>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-light disabled:opacity-60"
          >
            {isPending ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting…
              </>
            ) : mode === 'queue' ? (
              'Queue Task'
            ) : (
              'Submit Task'
            )}
          </button>
          <Link
            href="/tasks"
            className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-brand/40 hover:text-brand"
          >
            Cancel
          </Link>
        </div>

      </form>

      {/* Queue visualizer */}
      {mode === 'queue' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Queue</p>
            {queuedCount > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-muted">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                {queuedCount} submitted · polling every 2s
              </span>
            )}
          </div>
          <QueueVisualizer />
        </div>
      )}

    </div>
  );
}
