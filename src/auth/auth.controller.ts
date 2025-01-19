import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PaymentService } from '../payment/payment.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    console.log('Login attempt for:', loginDto.email);
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const result = await this.authService.login(user);
    return {
      ...result,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    };
  }

  @Post('register')
  async register(@Body() registerDto: { 
    email: string; 
    password: string; 
    name: string; 
    paymentIntentId: string;
  }) {
    console.log('Registration attempt for:', registerDto.email);
    return this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.name,
      registerDto.paymentIntentId,
    );
  }

  @Post('create-payment-intent')
  async createPaymentIntent() {
    return this.paymentService.createPaymentIntent();
  }
} 