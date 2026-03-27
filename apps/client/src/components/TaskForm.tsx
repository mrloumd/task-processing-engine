'use client';

import { useState } from 'react';
import { useCreateTask } from '@/hooks/useTasks';
import { TASK_TYPES, type TaskType } from '@task-processing-engine/shared';

export function TaskForm() {
  const [type, setType] = useState<TaskType>('email');
  const { mutate, isPending, isError, error } = useCreateTask();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ type });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        Create New Task
      </h2>

      <div className="mb-4">
        <label
          htmlFor="type"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Task Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as TaskType)}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
        >
          {TASK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      {isError && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {(error as Error).message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Submitting…' : 'Submit Task'}
      </button>
    </form>
  );
}
