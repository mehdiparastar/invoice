import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @EventPattern('notify_email')
  async notifyEmail(@Payload() data: NotifyEmailDto, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()
    channel.ack(originalMessage)

    return await this.notificationsService.notifyEmail(data)
  }
}
