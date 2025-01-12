import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { HealthModule, LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBITMQ_URI: Joi.string().required(),
        STRIPE_SECRET_KEY: Joi.string().required(),
      })
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          name: NOTIFICATIONS_SERVICE,
          transport: Transport.RMQ,
          options: { urls: [configService.getOrThrow<string>('RABBITMQ_URI')], queue: 'notifications' }
        }),
        inject: [ConfigService]
      }
    ]),
    HealthModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule { }
