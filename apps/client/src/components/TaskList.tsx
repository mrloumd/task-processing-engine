'use client';

import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { TaskStatusBadge } from './TaskStatusBadge';

export function TaskList() {
  const { data: tasks, isLoading, isError } = useTasks();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
        Failed to load tasks. Is the server running?
      </p>
    );
  }

  if (!tasks?.length) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
        No tasks yet — create one above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task._id}>
          <Link
            href={`/tasks/${task._id}`}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3.5 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-blue-700 dark:hover:bg-zinc-800"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium capitalize text-zinc-900 dark:text-zinc-50">
                {task.type.replace('-', ' ')}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(task.createdAt).toLocaleString()}
              </span>
            </div>
            <TaskStatusBadge status={task.status} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
