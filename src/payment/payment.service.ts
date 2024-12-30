import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    console.log('Initializing Stripe with key:', stripeKey ? 'present' : 'missing');
    
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createPaymentIntent(isMonthly: boolean = false): Promise<{ clientSecret: string }> {
    try {
      console.log('Creating payment intent, type:', isMonthly ? 'monthly' : 'one-time');
      
      if (isMonthly) {
        // Create a subscription
        const customer = await this.stripe.customers.create();
        console.log('Created customer:', customer.id);
        
        const subscription = await this.stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: this.configService.get<string>('STRIPE_MONTHLY_PRICE_ID') }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });
        console.log('Created subscription:', subscription.id);

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
        console.log('Created one-time payment intent:', paymentIntent.id);

        return {
          clientSecret: paymentIntent.client_secret,
        };
      }
    } catch (error) {
      console.error('Error in createPaymentIntent:', error);
      throw new UnauthorizedException('Error creating payment intent: ' + error.message);
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    try {
      console.log('Confirming payment intent:', paymentIntentId);
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      const isSuccessful = paymentIntent.status === 'succeeded';
      console.log('Payment status:', paymentIntent.status);
      return isSuccessful;
    } catch (error) {
      console.error('Error confirming payment:', error);
      return false;
    }
  }
} 