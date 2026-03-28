import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
const TASK_TYPES = ['file-processing', 'report-generation', 'ai-analysis'] as const;

const TASK_STATUSES = [
  'pending',
  'queued',
  'processing',
  'completed',
  'failed',
  'cancelled',
] as const;

export class QueryTasksDto {
  @IsOptional()
  @IsIn(TASK_STATUSES)
  status?: string;

  @IsOptional()
  @IsIn([...TASK_TYPES])
  type?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
