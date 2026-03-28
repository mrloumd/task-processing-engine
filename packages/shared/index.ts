// ─── Status & Types ──────────────────────────────────────────────────────────

export type TaskStatus =
  | 'pending'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export const TASK_TYPES = [
  'file-processing',
  'report-generation',
  'ai-analysis',
] as const;

export type TaskType = (typeof TASK_TYPES)[number];

export const TERMINAL_STATUSES: TaskStatus[] = ['completed', 'failed', 'cancelled'];

// ─── Activity Log ─────────────────────────────────────────────────────────────

export interface ActivityLogEntry {
  timestamp: string;
  event: string;
  detail?: string;
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export interface TaskItem {
  _id: string;
  type: TaskType;
  payload: Record<string, unknown>;
  status: TaskStatus;
  progress: number;
  result: string | null;
  error: string | null;
  retryCount: number;
  activityLog: ActivityLogEntry[];
  createdAt: string;
  updatedAt: string;
  startedAt: string | null;
  completedAt: string | null;
}

// ─── API Contracts ────────────────────────────────────────────────────────────

export interface CreateTaskPayload {
  type: TaskType;
  payload?: Record<string, unknown>;
}

export interface TasksQueryParams {
  status?: TaskStatus;
  type?: TaskType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TasksResponse {
  tasks: TaskItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MetricsSummary {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byType: Record<TaskType, number>;
  successRate: number;
}
