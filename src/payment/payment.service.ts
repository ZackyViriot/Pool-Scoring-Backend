import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createPaymentIntent(isMonthly: boolean = false): Promise<{ clientSecret: string }> {
    try {
      if (isMonthly) {
        // Create a subscription
        const customer = await this.stripe.customers.create();
        const subscription = await this.stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: this.configService.get<string>('STRIPE_MONTHLY_PRICE_ID') }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

        return {
          clientSecret: paymentIntent.client_secret,
        };
      } else {
        // Create a one-time payment
        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: 100, // $1.00 in cents
          currency: 'usd',
        });

        return {
          clientSecret: paymentIntent.client_secret,
        };
      }
    } catch (error) {
      throw new Error('Error creating payment intent');
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      return false;
    }
  }
} 