import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

// ─── Sub-document ─────────────────────────────────────────────────────────────

export interface ActivityEntry {
  timestamp: Date;
  event: string;
  detail?: string;
}

// ─── Task Schema ──────────────────────────────────────────────────────────────

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, trim: true })
  type: string;

  @Prop({ type: Object, default: {} })
  payload: Record<string, unknown>;

  @Prop({
    type: String,
    enum: ['pending', 'queued', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending',
    index: true,
  })
  status: string;

  @Prop({ type: Number, default: 0, min: 0, max: 100 })
  progress: number;

  @Prop({ type: String, default: null })
  result: string | null;

  @Prop({ type: String, default: null })
  error: string | null;

  @Prop({ type: Number, default: 0, min: 0 })
  retryCount: number;

  @Prop({ type: Date, default: null })
  startedAt: Date | null;

  @Prop({ type: Date, default: null })
  completedAt: Date | null;

  @Prop({
    type: [
      {
        timestamp: { type: Date, required: true },
        event: { type: String, required: true },
        detail: { type: String },
        _id: false,
      },
    ],
    default: [],
  })
  activityLog: ActivityEntry[];

  // Injected by @Schema({ timestamps: true })
  createdAt: Date;
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

// ─── Indexes ──────────────────────────────────────────────────────────────────

TaskSchema.index({ type: 1 });
TaskSchema.index({ createdAt: -1 });
TaskSchema.index({ status: 1, createdAt: -1 });
