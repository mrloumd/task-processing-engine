import { IsIn, IsObject, IsOptional, IsString } from 'class-validator';
import { TASK_TYPES } from '@task-processing-engine/shared';

export class CreateTaskDto {
  @IsString()
  @IsIn([...TASK_TYPES])
  type: string;

  @IsObject()
  @IsOptional()
  payload?: Record<string, unknown>;
}
