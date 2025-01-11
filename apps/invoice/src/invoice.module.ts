import { AUTH_SERVICE, DatabaseModule, LoggerModule, PAYMENTS_SERVICE } from '@app/common';
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
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
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
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('AUTH_HOST'),
            port: configService.getOrThrow<number>('AUTH_PORT')
          }
        }),
        inject: [ConfigService]
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          name: PAYMENTS_SERVICE,
          transport: Transport.TCP,
          options: {
            host: configService.getOrThrow<string>('PAYMENTS_HOST'),
            port: configService.getOrThrow<number>('PAYMENTS_PORT')
          }
        }),
        inject: [ConfigService]
      }
    ])
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule { }
