import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Model } from 'mongoose';
import { Queue } from 'bullmq';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectQueue('tasks') private readonly taskQueue: Queue,
  ) {}

  async create(dto: CreateTaskDto): Promise<TaskDocument> {
    const task = await this.taskModel.create({
      type: dto.type,
      payload: dto.payload ?? {},
    });

    await this.taskQueue.add(dto.type, {
      taskId: (task._id as unknown as string).toString(),
      ...dto.payload,
    });

    return task;
  }

  findAll(): Promise<TaskDocument[]> {
    return this.taskModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  updateStatus(
    id: string,
    status: TaskStatus,
    result: string | null = null,
    error: string | null = null,
  ): Promise<TaskDocument | null> {
    return this.taskModel
      .findByIdAndUpdate(id, { status, result, error }, { returnDocument: 'after' })
      .exec();
  }
}
