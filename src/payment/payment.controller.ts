import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create-payment-intent')
  async createPaymentIntent() {
    const result = await this.paymentService.createPaymentIntent();
    return result;
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