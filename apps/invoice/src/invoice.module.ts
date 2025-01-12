import { AUTH_SERVICE, DatabaseModule, HealthModule, LoggerModule, PAYMENTS_SERVICE } from '@app/common';
import { Module } from '@nestjs/common';
import { InvoiceController } from './invoice.controller';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceService } from './invoice.service';
import { InvoiceDocument, InvoiceSchema } from './models/invoice.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBITMQ_URI: Joi.string().required(),
      })
    }),
    DatabaseModule,
    DatabaseModule.forFeature([{ name: InvoiceDocument.name, schema: InvoiceSchema }]),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          name: AUTH_SERVICE,
          transport: Transport.RMQ,
          options: { urls: [configService.getOrThrow<string>('RABBITMQ_URI')], queue: 'auth' }
        }),
        inject: [ConfigService]
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          name: PAYMENTS_SERVICE,
          transport: Transport.RMQ,
          options: { urls: [configService.getOrThrow<string>('RABBITMQ_URI')], queue: 'payments' }
        }),
        inject: [ConfigService]
      }
    ]),
    HealthModule
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule { }
