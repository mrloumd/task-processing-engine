import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';
import { TaskDocument } from './schemas/task.schema';
import { fileProcessingHandler } from './handlers/file-processing.handler';
import { reportGenerationHandler } from './handlers/report-generation.handler';
import { aiAnalysisHandler } from './handlers/ai-analysis.handler';

// ─── Handler registry ─────────────────────────────────────────────────────────

type ProgressFn = (progress: number, detail: string) => Promise<void>;
type TaskHandlerFn = (
  payload: Record<string, unknown>,
  onProgress: ProgressFn,
) => Promise<Record<string, unknown>>;

const HANDLERS: Record<string, TaskHandlerFn> = {
  'file-processing': fileProcessingHandler,
  'report-generation': reportGenerationHandler,
  'ai-analysis': aiAnalysisHandler,
};

// ─── Processor ────────────────────────────────────────────────────────────────

@Processor('tasks', { concurrency: 1 })
export class TasksProcessor extends WorkerHost {
  private readonly logger = new Logger(TasksProcessor.name);

  constructor(private readonly tasksService: TasksService) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    const { taskId } = job.data as { taskId: string };

    // Guard: task may have been cancelled before worker picked it up
    let task: TaskDocument;
    try {
      task = await this.tasksService.findOne(taskId);
    } catch {
      this.logger.warn(`Job ${job.id}: task=${taskId} not found, skipping`);
      return null;
    }

    if (task.status === 'cancelled') {
      this.logger.warn(`Job ${job.id}: task=${taskId} is cancelled, skipping`);
      return null;
    }

    const handler = HANDLERS[task.type];
    if (!handler) {
      const error = `No handler registered for task type: "${task.type}"`;
      this.logger.error(error);
      await this.tasksService.markFailed(taskId, error);
      throw new Error(error);
    }

    this.logger.log(
      `Processing task=${taskId} type=${task.type} attempt=${job.attemptsMade + 1}`,
    );
    await this.tasksService.markProcessing(taskId);

    const onProgress: ProgressFn = (progress, detail) =>
      this.tasksService.updateProgress(taskId, progress, {
        event: 'progress',
        detail,
      });

    try {
      const result = await handler(
        task.payload as Record<string, unknown>,
        onProgress,
      );
      await this.tasksService.markCompleted(taskId, JSON.stringify(result));
      this.logger.log(`Completed task=${taskId}`);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown processing error';
      this.logger.error(`Failed task=${taskId}: ${message}`);
      await this.tasksService.markFailed(taskId, message);
      throw err; // re-throw so BullMQ applies retry backoff
    }
  }
}
