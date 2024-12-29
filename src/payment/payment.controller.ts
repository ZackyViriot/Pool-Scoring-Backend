import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { isMonthly: boolean }) {
    try {
      return await this.paymentService.createPaymentIntent(body.isMonthly);
    } catch (error) {
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