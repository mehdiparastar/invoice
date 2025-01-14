import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
    constructor(private readonly configService: ConfigService) { }

    private readonly transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: this.configService.getOrThrow<string>("SMTP_USER"),
            clientId: this.configService.getOrThrow<string>("GOOGLE_OAUTH_CLIENT_ID"),
            clientSecret: this.configService.getOrThrow<string>("GOOGLE_OAUTH_CLIENT_SECRET"),
            refreshToken: this.configService.getOrThrow<string>("GOOGLE_OAUTH_REFRESH_TOKEN")
        }
    })

    async notifyEmail({ email, subject, text, html }: NotifyEmailDto) {
        await this.transporter.sendMail({
            from: this.configService.getOrThrow<string>('SMTP_USER'),
            to: email,
            subject: subject || 'Payment Notification From Invoice APP',
            text: text || 'Payment Notification From Invoice APP',
            html: html || undefined
        })
    }
}
