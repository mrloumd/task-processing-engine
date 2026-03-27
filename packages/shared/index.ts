export type TaskStatus = 'pending' | 'active' | 'completed' | 'failed';

export const TASK_TYPES = ['email', 'report', 'data-sync', 'custom'] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export interface TaskItem {
  _id: string;
  type: TaskType;
  payload: Record<string, unknown>;
  status: TaskStatus;
  result: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  type: TaskType;
  payload?: Record<string, unknown>;
}
