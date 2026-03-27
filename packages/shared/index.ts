export type TaskStatus = "pending" | "active" | "completed" | "failed";

export interface TaskItem {
  id: string;
  type: string;
  status: TaskStatus;
  result?: string | null;
  createdAt: string;
  updatedAt: string;
}
