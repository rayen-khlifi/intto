import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { createHash, randomInt } from 'crypto';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../users/schemas/user.schema';
import { MailService } from '../mail/mail.service';

function hashOtp(email: string, code: string) {
  return createHash('sha256').update(`${email}:${code}`).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userModel.exists({ email: dto.email.toLowerCase() });
    if (exists) throw new BadRequestException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.userModel.create({
      email: dto.email.toLowerCase(),
      passwordHash,
      role: dto.role,
      displayName: dto.displayName,
      profile: {}, // candidate/company profile fields handled via /users/profile
      isEmailVerified: false,
    });

    // ✅ Generate OTP + send email
    const code = String(randomInt(100000, 999999));
    user.emailOtpHash = hashOtp(user.email, code);
    user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    await this.mail.sendOtp(user.email, code);

    const tokens = await this.issueTokens(user.id, user.role);
    return { user: this.sanitize(user), ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    // ❌ Block login until email verified (optional but recommended)
    if (!user.isEmailVerified) {
      throw new BadRequestException('Please check your email first');
    }

    const tokens = await this.issueTokens(user.id, user.role);
    return { user: this.sanitize(user), ...tokens };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    if (!user) throw new BadRequestException('User not found');

    if (user.isEmailVerified) {
      return { message: 'Email already verified' };
    }

    if (!user.emailOtpHash || !user.emailOtpExpiresAt) {
      throw new BadRequestException('No OTP request found');
    }

    if (user.emailOtpExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('OTP expired');
    }

    const incomingHash = hashOtp(user.email, code);
    if (incomingHash !== user.emailOtpHash) {
      throw new BadRequestException('Invalid code');
    }

    user.isEmailVerified = true;
    user.emailOtpHash = null;
    user.emailOtpExpiresAt = null;
    await user.save();

    await this.mail.sendWelcome(user.email, user.displayName);

    return { message: 'Email verified successfully' };
  }

  async resendOtp(email: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    if (!user) throw new BadRequestException('User not found');

    if (user.isEmailVerified) {
      return { message: 'Email already verified' };
    }

    const code = String(randomInt(100000, 999999));
    user.emailOtpHash = hashOtp(user.email, code);
    user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await this.mail.sendOtp(user.email, code);

    return { message: 'OTP sent' };
  }

  private async issueTokens(userId: string, role: string) {
    const accessToken = await this.jwt.signAsync(
      { sub: userId, role },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
      },
    );

    const refreshToken = await this.jwt.signAsync(
      { sub: userId, role },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
      },
    );

    return { accessToken, refreshToken };
  }

  sanitize(user: UserDocument) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      displayName: user.displayName,
      profile: user.profile ?? {},
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
