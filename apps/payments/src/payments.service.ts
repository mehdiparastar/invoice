import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsClient: ClientProxy
  ) { }

  private readonly stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'), { apiVersion: '2024-12-18.acacia' })

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method: 'pm_card_visa',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });


    // const paymentIntent = await this.stripe.charges.create({
    //   amount: amount * 100, // Convert to cents
    //   currency: 'usd',
    //   source: "tok_visa", // Pass the token here
    // });


    // const paymentMethod = await this.stripe.paymentMethods.create({ type: 'card', card: { ...card, token: '' } });
    // const paymentIntent = await this.stripe.paymentIntents.create({
    //   payment_method: paymentMethod.id,
    //   amount: amount * 100,
    //   confirm: true,
    //   payment_method_types: ['card'],
    //   currency: 'usd',
    // });

    this.notificationsClient.emit(
      'notify_email',
      {
        email,
        subject: "Payment Succeed (Invoice APP)",
        text: `Your Payment of $${amount} has completed successfully. (payment id is: '${paymentIntent.id}')`
      }
    )

    return paymentIntent;
  }
}
