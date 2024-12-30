import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { isMonthly: boolean }) {
    try {
      console.log('Creating payment intent for:', body.isMonthly ? 'monthly' : 'one-time');
      const result = await this.paymentService.createPaymentIntent(body.isMonthly);
      console.log('Payment intent created:', !!result);
      return result;
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw new UnauthorizedException('Payment failed');
    }
  }

  @Post('confirm-payment')
  async confirmPayment(@Body() body: { paymentIntentId: string }) {
    const isSuccess = await this.paymentService.confirmPayment(body.paymentIntentId);
    if (!isSuccess) {
      throw new UnauthorizedException('Payment confirmation failed');
    }
    return { success: true };
  }
} 