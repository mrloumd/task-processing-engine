'use client';

import Link from 'next/link';
import { TaskStats } from '@/components/tasks/TaskStats';
import { TaskList } from '@/components/tasks/TaskList';
import { useTasks, useMetrics } from '@/hooks/useTasks';

export default function DashboardPage() {
  const { data, isLoading, isError } = useTasks({ limit: 5, page: 1 });
  const { data: metrics } = useMetrics();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-10 pt-24 space-y-10">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-20 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-brand/10 blur-[100px]" />
          <div className="absolute top-10 left-1/4 h-[250px] w-[350px] rounded-full bg-brand-dark/8 blur-[70px]" />
        </div>

        <div className="mx-auto max-w-3xl px-2 pb-10 pt-4 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3.5 py-1.5 text-xs font-medium text-brand-light">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
            Async task processing in real time
          </div>
          <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Queue Tasks.{' '}
            <span className="bg-gradient-to-r from-brand-light via-brand to-brand-dark bg-clip-text text-transparent">
              Watch Them Run.
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base text-muted">
            Create background jobs, track their progress in real time, retry on failure,
            and cancel mid-flight — all from a single dashboard.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/create-task"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-light"
            >
              Create Task
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-brand/40 hover:text-foreground"
            >
              View All Tasks
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-border pt-8">
            {[
              { value: '3',   label: 'Task Types' },
              { value: '3',   label: 'Concurrent Workers' },
              { value: 'Live', label: 'Real-time Updates' },
              { value: metrics?.successRate != null ? `${metrics.successRate}%` : '—', label: 'Success Rate' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-sm font-bold text-brand">{value}</p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats cards */}
      <TaskStats />

      {/* Recent tasks */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted">
            Recent Tasks
          </h2>
          <Link
            href="/tasks"
            className="text-xs font-medium text-brand transition-colors hover:text-brand-light"
          >
            View all →
          </Link>
        </div>
        <TaskList
          tasks={data?.tasks ?? []}
          isLoading={isLoading}
          isError={isError}
          emptyMessage="No tasks yet. Create your first task."
        />
      </section>

    </div>
  );
}
