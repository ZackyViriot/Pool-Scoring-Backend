import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PaymentService } from '../payment/payment.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private paymentService: PaymentService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('Attempting to validate user:', email);
    const user = await this.usersService.findByEmail(email);
    console.log('User found:', user ? 'Yes' : 'No');
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid ? 'Yes' : 'No');
      if (isPasswordValid) {
        const { password, ...result } = user.toObject();
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    };
  }

  async register(email: string, password: string, name: string, paymentIntentId: string) {
    try {
      console.log('Starting registration for:', email, 'with payment intent:', paymentIntentId);
      
      // Verify payment was successful
      const paymentConfirmed = await this.paymentService.confirmPayment(paymentIntentId);
      if (!paymentConfirmed) {
        console.log('Payment verification failed for payment intent:', paymentIntentId);
        throw new UnauthorizedException('Payment verification failed. Please ensure your payment was successful and try again.');
      }

      console.log('Payment verified successfully, creating user account');
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.usersService.create({
        email,
        password: hashedPassword,
        name,
        hasPaid: true,
      });

      console.log('User account created successfully:', user.email);
      const { password: _, ...result } = user.toObject();
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Registration failed. Please try again.');
    }
  }
} 