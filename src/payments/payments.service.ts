import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-06-20',
    });
  }

  async createPaymentIntent(dto: CreatePaymentDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(dto.amount * 100), // convert to cents
      currency: dto.currency,
      payment_method_types: ['card'],
    });
    return { clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(payload: Buffer, sig: string) {
    const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    const event = this.stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    return event;
  }
}
