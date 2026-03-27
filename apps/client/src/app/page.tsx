import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Task Queue
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Submit background jobs and monitor their progress in real time.
        </p>
      </div>

      <TaskForm />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Recent Tasks
        </h2>
        <TaskList />
      </section>
    </div>
  );
}
