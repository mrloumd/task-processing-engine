import { IsIn, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export const TASK_TYPES = ['email', 'report', 'data-sync', 'custom'] as const;
export type TaskType = (typeof TASK_TYPES)[number];

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(TASK_TYPES)
  type: TaskType;

  @IsObject()
  @IsOptional()
  payload?: Record<string, unknown>;
}
