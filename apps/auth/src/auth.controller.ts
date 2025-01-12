import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { CurrentUser, UserDocument } from '@app/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserDocument, @Res({ passthrough: true }) response: Response) {
    await this.authService.login(user, response)
    response.send(user)
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef()
    const originalMessage = context.getMessage()
    channel.ack(originalMessage)

    return data.user
  }
}
