import { Injectable, UnauthorizedException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    console.log('Initializing Stripe with key:', stripeKey ? 'present' : 'missing');
    
    if (!stripeKey) {
      console.error('No Stripe secret key found. Please set STRIPE_SECRET_KEY in your .env file');
      throw new Error('Stripe secret key is required but not found in environment variables');
    }
    
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createPaymentIntent(): Promise<{ clientSecret: string }> {
    try {
      console.log('Creating one-time payment intent');
      
      // Create a one-time payment
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 2000, // $20.00 in cents
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
      
      if (!paymentIntentId || paymentIntentId.trim() === '') {
        console.error('Payment intent ID is empty or invalid');
        return false;
      }
      
      // Try to retrieve the payment intent
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      console.log('Payment intent status:', paymentIntent.status);
      console.log('Payment intent amount:', paymentIntent.amount);
      console.log('Payment intent currency:', paymentIntent.currency);
      
      // Check if the payment was successful
      const isSuccessful = paymentIntent.status === 'succeeded';
      
      if (isSuccessful) {
        console.log('Payment confirmed successfully');
        return true;
      } else {
        console.log('Payment not successful, status:', paymentIntent.status);
        return false;
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      
      // If the payment intent doesn't exist, it might have already been confirmed
      // or there might be an issue with the ID
      if (error.code === 'resource_missing') {
        console.log('Payment intent not found, it may have already been confirmed');
        // You might want to return true here if you're confident the payment was processed
        // For now, we'll return false to be safe
        return false;
      }
      
      // Log additional error details
      if (error.type) {
        console.log('Stripe error type:', error.type);
      }
      if (error.param) {
        console.log('Stripe error param:', error.param);
      }
      
      return false;
    }
  }
} 