import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';

const TASK_TYPES = ['file-processing', 'report-generation', 'ai-analysis'] as const;

export class CreateTaskDto {
  @IsString()
  @IsIn([...TASK_TYPES])
  type: string;

  @IsObject()
  @IsOptional()
  payload?: Record<string, unknown>;
}
