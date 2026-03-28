'use client';

import { useState } from 'react';
import { useCreateTask } from '@/hooks/useTasks';
import { TASK_TYPES, type TaskType } from '@task-processing-engine/shared';

const TYPE_ICONS: Record<TaskType, string> = {
  'file-processing':   '📄',
  'report-generation': '📊',
  'ai-analysis':       '🤖',
};

const TYPE_DESC: Record<TaskType, string> = {
  'file-processing':   'Parse and extract data from files',
  'report-generation': 'Generate formatted PDF reports',
  'ai-analysis':       'Run NLP inference on text',
};

export function TaskForm() {
  const [type, setType] = useState<TaskType>('file-processing');
  const { mutate, isPending, isError, isSuccess, error, reset } = useCreateTask();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutate({ type }, { onSuccess: () => setTimeout(reset, 2000) });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      {/* Header */}
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
          </svg>
        </div>
        <h2 className="text-base font-semibold text-foreground">New Task</h2>
      </div>

      {/* Task type selector */}
      <div className="mb-4 space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted">
          Task Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {TASK_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition-all ${
                type === t
                  ? 'border-brand bg-brand/10 text-brand shadow-sm'
                  : 'border-border bg-surface-raised text-foreground hover:border-brand/50 hover:bg-brand/5'
              }`}
            >
              <span className="text-base leading-none">{TYPE_ICONS[t]}</span>
              <span>
                <span className="block font-medium capitalize">{t.replace(/-/g, ' ')}</span>
                <span className="block text-[10px] opacity-70">{TYPE_DESC[t]}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback */}
      {isError && (
        <p className="mb-3 rounded-lg border border-red-800 bg-red-950/40 px-3 py-2 text-xs text-red-400">
          {(error as Error).message}
        </p>
      )}
      {isSuccess && (
        <p className="mb-3 rounded-lg border border-emerald-800 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-400">
          Task queued successfully!
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand/20 transition-all hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Queuing…
          </span>
        ) : (
          'Queue Task'
        )}
      </button>
    </form>
  );
}
