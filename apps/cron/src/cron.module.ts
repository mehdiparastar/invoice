import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { DatabaseModule, HealthModule, InvoiceDocument, InvoiceRepository, InvoiceSchema, LoggerModule, NOTIFICATIONS_SERVICE, UserDocument, UserSchema, UsersRepository } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
      { name: InvoiceDocument.name, schema: InvoiceSchema },
    ]),
    ScheduleModule.forRoot(),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        RABBITMQ_URI: Joi.string().required(),
      })
    }),
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
  providers: [CronService, UsersRepository, InvoiceRepository],
})
export class CronModule { }
