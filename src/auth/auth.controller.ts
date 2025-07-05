import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PaymentService } from '../payment/payment.service';
import { RegisterDto } from './dto/auth.dto';

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
  async register(@Body() registerDto: RegisterDto) {
    console.log('Registration request received for:', registerDto.email);
    console.log('Payment intent ID:', registerDto.paymentIntentId);
    console.log('Request body:', JSON.stringify(registerDto, null, 2));
    
    try {
      const result = await this.authService.register(
        registerDto.email,
        registerDto.password,
        registerDto.name,
        registerDto.paymentIntentId,
      );
      console.log('Registration successful for:', registerDto.email);
      return result;
    } catch (error) {
      console.error('Registration failed for:', registerDto.email, 'Error:', error.message);
      
      // If it's a validation error, provide more specific feedback
      if (error.message && error.message.includes('validation')) {
        throw new UnauthorizedException('Invalid registration data. Please check your information and try again.');
      }
      
      throw error;
    }
  }

  @Post('create-payment-intent')
  async createPaymentIntent() {
    return this.paymentService.createPaymentIntent();
  }

  @Post('test')
  async test() {
    return { message: 'Auth controller is working', timestamp: new Date().toISOString() };
  }
} 