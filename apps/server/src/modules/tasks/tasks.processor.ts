import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { TasksService } from './tasks.service';

@Processor('tasks')
export class TasksProcessor extends WorkerHost {
  private readonly logger = new Logger(TasksProcessor.name);

  constructor(private readonly tasksService: TasksService) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    const { taskId, ...payload } = job.data as {
      taskId: string;
      [key: string]: unknown;
    };

    this.logger.log(`Processing job [${job.name}] taskId=${taskId}`);
    await this.tasksService.updateStatus(taskId, 'active');

    try {
      const result = await this.handleJobType(job.name, payload);
      await this.tasksService.updateStatus(
        taskId,
        'completed',
        JSON.stringify(result),
      );
      this.logger.log(`Completed job [${job.name}] taskId=${taskId}`);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(
        `Failed job [${job.name}] taskId=${taskId}: ${message}`,
      );
      await this.tasksService.updateStatus(taskId, 'failed', null, message);
      throw err;
    }
  }

  private async handleJobType(
    type: string,
    payload: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    // Simulate async processing (2–5 seconds)
    await new Promise((resolve) =>
      setTimeout(resolve, 2000 + Math.random() * 3000),
    );

    switch (type) {
      case 'email':
        return { sent: true, to: payload['to'] ?? 'user@example.com' };
      case 'report':
        return { generated: true, rows: Math.floor(Math.random() * 1000) };
      case 'data-sync':
        return { synced: true, records: Math.floor(Math.random() * 500) };
      default:
        return { processed: true, type, payload };
    }
  }
}
