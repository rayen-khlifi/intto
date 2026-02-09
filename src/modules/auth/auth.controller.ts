import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.register(dto);

    res.cookie('accessToken', result.accessToken, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });

    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.login(dto);

    res.cookie('accessToken', result.accessToken, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
    res.cookie('refreshToken', result.refreshToken, { httpOnly: true, sameSite: 'lax', secure: false, path: '/' });

    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('verify-email')
  verifyEmail(@Body() body: { email: string; code: string }) {
    return this.auth.verifyEmail(body.email, body.code);
  }

  @Post('resend-otp')
  resendOtp(@Body() body: { email: string }) {
    return this.auth.resendOtp(body.email);
  }
}
