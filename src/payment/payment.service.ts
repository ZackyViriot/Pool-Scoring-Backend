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

  async createPaymentIntent(): Promise<{ clientSecret: string }> {
    try {
      console.log('Creating one-time payment intent');
      
      // Create a one-time payment
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 1000, // $10.00 in cents
        currency: 'usd',
      });
      console.log('Created one-time payment intent:', paymentIntent.id);

      return {
        clientSecret: paymentIntent.client_secret,
      };
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