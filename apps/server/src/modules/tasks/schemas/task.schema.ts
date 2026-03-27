import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

export type TaskStatus = 'pending' | 'active' | 'completed' | 'failed';

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  type: string;

  @Prop({ type: Object, default: {} })
  payload: Record<string, unknown>;

  @Prop({
    default: 'pending',
    enum: ['pending', 'active', 'completed', 'failed'],
  })
  status: TaskStatus;

  @Prop({ type: String, default: null })
  result: string | null;

  @Prop({ type: String, default: null })
  error: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
