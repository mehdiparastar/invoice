import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  constructor(private readonly configService: ConfigService) { }

  private readonly stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET_KEY'), { apiVersion: '2024-12-18.acacia' })

  async createCharge({ card, amount }: CreateChargeDto) {

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

    return paymentIntent;
  }
}
