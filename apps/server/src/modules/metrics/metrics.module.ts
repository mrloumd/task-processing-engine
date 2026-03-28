import { Module } from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [MetricsController],
})
export class MetricsModule {}
