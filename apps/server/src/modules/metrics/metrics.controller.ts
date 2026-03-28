import { Controller, Get } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('summary')
  summary() {
    return this.tasksService.getMetrics();
  }
}
