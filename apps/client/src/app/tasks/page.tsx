'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { TaskList } from '@/components/tasks/TaskList';
import { useTasks } from '@/hooks/useTasks';
import type { TaskStatus, TaskType } from '@task-processing-engine/shared';
import { TASK_TYPES } from '@task-processing-engine/shared';

const STATUSES: TaskStatus[] = [
  'pending', 'queued', 'processing', 'completed', 'failed', 'cancelled',
];

export default function TasksPage() {
  const [status, setStatus]   = useState<TaskStatus | ''>('');
  const [type, setType]       = useState<TaskType | ''>('');
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const LIMIT = 10;

  const { data, isLoading, isError } = useTasks({
    status: status || undefined,
    type:   type   || undefined,
    search: search || undefined,
    page,
    limit: LIMIT,
  });

  const reset = useCallback(() => {
    setStatus('');
    setType('');
    setSearch('');
    setPage(1);
  }, []);

  const hasFilter = status || type || search;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">All Tasks</h1>
          <p className="mt-0.5 text-sm text-muted">
            {data ? `${data.total} task${data.total !== 1 ? 's' : ''}` : '—'}
            {hasFilter ? ' matched' : ' total'}
          </p>
        </div>
        <Link
          href="/create-task"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-light sm:self-auto"
        >
          + New Task
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by type…"
            className="w-full rounded-xl border border-border bg-surface py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted focus:border-brand/50 focus:outline-none"
          />
        </div>

        {/* Status filter */}
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value as TaskStatus | ''); setPage(1); }}
          className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-brand/50 focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>

        {/* Type filter */}
        <select
          value={type}
          onChange={(e) => { setType(e.target.value as TaskType | ''); setPage(1); }}
          className="rounded-xl border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-brand/50 focus:outline-none"
        >
          <option value="">All types</option>
          {TASK_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {/* Clear */}
        {hasFilter && (
          <button
            onClick={reset}
            className="rounded-xl border border-border px-3 py-2 text-xs text-muted transition-colors hover:border-brand/40 hover:text-brand"
          >
            Clear
          </button>
        )}
      </div>

      {/* List */}
      <TaskList
        tasks={data?.tasks ?? []}
        isLoading={isLoading}
        isError={isError}
        emptyMessage={hasFilter ? 'No tasks match your filters.' : 'No tasks yet.'}
      />

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-xs text-muted">
            Page {page} / {data.totalPages}
          </span>
          <button
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
}
