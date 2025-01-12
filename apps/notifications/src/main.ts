import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService)
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: { urls: [configService.getOrThrow<string>('RABBITMQ_URI')], noAck: false, queue: 'notifications' }
  })
  app.useLogger(app.get(Logger))
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.startAllMicroservices();
}
bootstrap();
