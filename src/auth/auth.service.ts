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
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(email: string, password: string, name: string, paymentIntentId: string) {
    // Verify payment was successful
    const paymentConfirmed = await this.paymentService.confirmPayment(paymentIntentId);
    if (!paymentConfirmed) {
      throw new UnauthorizedException('Payment verification failed');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
      hasPaid: true,
    });

    const { password: _, ...result } = user.toObject();
    return result;
  }
} 