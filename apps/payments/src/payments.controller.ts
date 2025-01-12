import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @MessagePattern('create_charge')
  async createCharge(@Payload() data: PaymentsCreateChargeDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()
    channel.ack(originalMessage)
    
    return this.paymentsService.createCharge(data)
  }
}
