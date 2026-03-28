import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  check() {
    const state = this.connection.readyState;

    return {
      status: 'ok',
      mongodb: {
        status: state === ConnectionStates.connected ? 'connected' : 'disconnected',
      },
    };
  }
}
