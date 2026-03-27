'use client';

import { use } from 'react';
import Link from 'next/link';
import { useTask } from '@/hooks/useTasks';
import { TaskStatusBadge } from '@/components/TaskStatusBadge';

interface Props {
  params: Promise<{ id: string }>;
}

export default function TaskDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: task, isLoading, isError } = useTask(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-40 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800" />
      </div>
    );
  }

  if (isError || !task) {
    return (
      <div className="space-y-4">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to queue
        </Link>
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          Task not found or failed to load.
        </p>
      </div>
    );
  }

  const isTerminal = task.status === 'completed' || task.status === 'failed';

  let parsedResult: unknown = null;
  try {
    if (task.result) parsedResult = JSON.parse(task.result);
  } catch {
    parsedResult = task.result;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to queue
        </Link>
        {!isTerminal && (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Polling every 2s…
          </span>
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold capitalize text-zinc-900 dark:text-zinc-50">
              {task.type.replace('-', ' ')} Task
            </h1>
            <p className="mt-1 font-mono text-xs text-zinc-400">{task._id}</p>
          </div>
          <TaskStatusBadge status={task.status} />
        </div>

        <dl className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <Row label="Created">
            {new Date(task.createdAt).toLocaleString()}
          </Row>
          <Row label="Updated">
            {new Date(task.updatedAt).toLocaleString()}
          </Row>

          {Object.keys(task.payload).length > 0 && (
            <Row label="Payload">
              <pre className="whitespace-pre-wrap break-all font-mono text-xs">
                {JSON.stringify(task.payload, null, 2)}
              </pre>
            </Row>
          )}

          {task.status === 'completed' && parsedResult !== null && (
            <Row label="Result">
              <pre className="whitespace-pre-wrap break-all font-mono text-xs text-green-700 dark:text-green-400">
                {JSON.stringify(parsedResult, null, 2)}
              </pre>
            </Row>
          )}

          {task.status === 'failed' && task.error && (
            <Row label="Error">
              <span className="text-sm text-red-600 dark:text-red-400">
                {task.error}
              </span>
            </Row>
          )}
        </dl>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 py-3">
      <dt className="w-24 shrink-0 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="text-sm text-zinc-900 dark:text-zinc-50">{children}</dd>
    </div>
  );
}
