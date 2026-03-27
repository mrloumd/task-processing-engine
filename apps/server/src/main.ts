import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
  );

  // MongoDB connection logs
  const green = '\x1b[32m';
  const red = '\x1b[31m';
  const yellow = '\x1b[33m';
  const reset = '\x1b[0m';

  const mongoConnection = app.get<Connection>(getConnectionToken());

  // The 'connected' event fires during NestFactory.create() before this runs,
  // so we check readyState immediately to catch an already-open connection.
  if (mongoConnection.readyState === 1) {
    console.log(`${green}[MongoDB] Connected${reset}`);
  }

  mongoConnection.on('connected', () => {
    console.log(`${green}[MongoDB] Connected${reset}`);
  });
  mongoConnection.on('disconnected', () => {
    console.warn(`${yellow}[MongoDB] Disconnected${reset}`);
  });
  mongoConnection.on('error', (err: Error) => {
    console.error(`${red}[MongoDB] Error connecting: ${err.message}${reset}`);
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`[Server] Running on http://localhost:${port}/api`);
}
bootstrap();
