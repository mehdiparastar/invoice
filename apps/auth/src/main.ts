import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser'
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService)
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: { urls: [configService.getOrThrow<string>('RABBITMQ_URI')], noAck: false, queue: 'auth' }
  })
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useLogger(app.get(Logger))
  app.startAllMicroservices()
  await app.listen(configService.getOrThrow<number>('HTTP_PORT'));
}
bootstrap();
