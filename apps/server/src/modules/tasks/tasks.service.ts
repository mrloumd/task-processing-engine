import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Model } from 'mongoose';
import { Queue } from 'bullmq';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

const QUEUE_JOB_OPTIONS = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 3000 },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 200 },
};

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectQueue('tasks') private readonly taskQueue: Queue,
  ) {}

  // ─── Create ────────────────────────────────────────────────────────────────

  async create(dto: CreateTaskDto): Promise<TaskDocument> {
    const task = await this.taskModel.create({
      type: dto.type,
      payload: dto.payload ?? {},
      status: 'pending',
      activity_log: [
        {
          timestamp: new Date(),
          event: 'created',
          detail: `Task of type "${dto.type}" was submitted`,
        },
      ],
    });

    const taskId = (task._id as unknown as string).toString();

    await this.taskQueue.add('process', { taskId }, QUEUE_JOB_OPTIONS);

    await this.taskModel.updateOne(
      { _id: taskId },
      {
        $set: { status: 'queued' },
        $push: {
          activity_log: {
            timestamp: new Date(),
            event: 'queued',
            detail: 'Job added to the processing queue',
          },
        },
      },
    );

    this.logger.log(`Task created: id=${taskId} type=${dto.type}`);
    return this.taskModel.findById(taskId).exec() as Promise<TaskDocument>;
  }

  // ─── Read ──────────────────────────────────────────────────────────────────

  async findAll(query: QueryTasksDto): Promise<{
    tasks: TaskDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const { status, type, search, page = 1, limit = 20 } = query;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) filter.type = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;

    const [tasks, total] = await Promise.all([
      this.taskModel.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit).exec(),
      this.taskModel.countDocuments(filter).exec(),
    ]);

    return { tasks, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  // ─── Retry / Cancel ────────────────────────────────────────────────────────

  async retry(id: string): Promise<TaskDocument> {
    const task = await this.findOne(id);

    if (task.status !== 'failed') {
      throw new BadRequestException('Only failed tasks can be retried');
    }

    const retry_count = task.retry_count + 1;

    await this.taskModel.updateOne(
      { _id: id },
      {
        $set: {
          status: 'queued',
          progress: 0,
          error: null,
          result: null,
          started_at: null,
          completed_at: null,
          retry_count,
        },
        $push: {
          activity_log: {
            timestamp: new Date(),
            event: 'retry_requested',
            detail: `Retry attempt #${retry_count}`,
          },
        },
      },
    );

    await this.taskQueue.add('process', { taskId: id }, QUEUE_JOB_OPTIONS);

    await this.taskModel.updateOne(
      { _id: id },
      {
        $push: {
          activity_log: {
            timestamp: new Date(),
            event: 'queued',
            detail: 'Task re-queued for processing',
          },
        },
      },
    );

    this.logger.log(`Task retried: id=${id} attempt=#${retry_count}`);
    return this.taskModel.findById(id).exec() as Promise<TaskDocument>;
  }

  async cancel(id: string): Promise<TaskDocument> {
    const task = await this.findOne(id);

    if (!['pending', 'queued'].includes(task.status)) {
      throw new BadRequestException(
        'Only pending or queued tasks can be cancelled',
      );
    }

    // Best-effort removal from BullMQ; processor checks status on pickup
    try {
      const waiting = await this.taskQueue.getJobs(['waiting', 'delayed']);
      const job = waiting.find((j) => j.data.taskId === id);
      if (job) await job.remove();
    } catch { /* no-op */ }

    await this.taskModel.updateOne(
      { _id: id },
      {
        $set: { status: 'cancelled' },
        $push: {
          activity_log: {
            timestamp: new Date(),
            event: 'cancelled',
            detail: 'Task cancelled by user',
          },
        },
      },
    );

    this.logger.warn(`Task cancelled: id=${id}`);
    return this.taskModel.findById(id).exec() as Promise<TaskDocument>;
  }

  // ─── Processor callbacks ───────────────────────────────────────────────────

  async markProcessing(id: string): Promise<void> {
    await this.taskModel.updateOne(
      { _id: id },
      {
        $set: { status: 'processing', started_at: new Date(), progress: 0 },
        $push: {
          activity_log: {
            timestamp: new Date(),
            event: 'processing_started',
            detail: 'Worker picked up the task',
          },
        },
      },
    );
  }

  async updateProgress(
    id: string,
    progress: number,
    logEntry?: { event: string; detail?: string },
  ): Promise<void> {
    const update: Record<string, unknown> = { $set: { progress } };
    if (logEntry) {
      (update as Record<string, unknown>)['$push'] = {
        activity_log: {
          timestamp: new Date(),
          event: logEntry.event,
          detail: logEntry.detail,
        },
      };
    }
    await this.taskModel.updateOne({ _id: id }, update);
  }

  async markCompleted(id: string, result: string): Promise<void> {
    await this.taskModel.updateOne(
      { _id: id },
      {
        $set: { status: 'completed', result, progress: 100, completed_at: new Date() },
        $push: {
          activity_log: {
            timestamp: new Date(),
            event: 'completed',
            detail: 'Task completed successfully',
          },
        },
      },
    );
  }

  async markFailed(id: string, error: string): Promise<void> {
    await this.taskModel.updateOne(
      { _id: id },
      {
        $set: { status: 'failed', error },
        $push: {
          activity_log: { timestamp: new Date(), event: 'failed', detail: error },
        },
      },
    );
  }

  // ─── Metrics ───────────────────────────────────────────────────────────────

  async getMetrics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
    byType: Record<string, number>;
    successRate: number;
  }> {
    const [byStatusRaw, byTypeRaw, total] = await Promise.all([
      this.taskModel.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]).exec(),
      this.taskModel.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]).exec(),
      this.taskModel.countDocuments().exec(),
    ]);

    const byStatus: Record<string, number> = {
      pending: 0, queued: 0, processing: 0, completed: 0, failed: 0, cancelled: 0,
    };
    for (const { _id, count } of byStatusRaw) {
      if (_id in byStatus) byStatus[_id] = count;
    }

    const byType: Record<string, number> = {
      'file-processing': 0, 'report-generation': 0, 'ai-analysis': 0,
    };
    for (const { _id, count } of byTypeRaw) {
      if (_id in byType) byType[_id] = count;
    }

    const { completed, failed } = byStatus;
    const successRate =
      completed + failed > 0
        ? Math.round((completed / (completed + failed)) * 100)
        : 0;

    return { total, byStatus, byType, successRate };
  }
}
