'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateTask } from '@/hooks/useTasks';
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

export default function CreateTaskPage() {
  const router = useRouter();
  const { mutateAsync: createTask, isPending, isError, error } = useCreateTask();

  const [selectedType, setSelectedType] = useState<TaskType>('file-processing');
  const [payloadValue, setPayloadValue] = useState('');

  const meta = TYPE_META[selectedType];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: Record<string, unknown> = {};
    if (meta.payloadField && payloadValue.trim()) {
      payload[meta.payloadField.name] = payloadValue.trim();
    }
    const task = await createTask({ type: selectedType, payload });
    router.push(`/tasks/${task._id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Back */}
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-foreground">
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to dashboard
      </Link>

      <div>
        <h1 className="text-xl font-bold text-foreground">Create a Task</h1>
        <p className="mt-0.5 text-sm text-muted">Choose a task type and submit it to the processing queue.</p>
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
          <div className="rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3">
            <p className="text-sm text-red-400">
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
    </div>
  );
}
