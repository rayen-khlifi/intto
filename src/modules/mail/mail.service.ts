import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter?: nodemailer.Transporter;

  constructor() {
    const host = process.env.MAIL_HOST;
    const port = Number(process.env.MAIL_PORT || 587);
    const user = process.env.MAIL_USER;
    const pass = process.env.MAIL_PASS;

    if (!host || !user || !pass) {
      this.logger.warn('SMTP not configured. Set MAIL_HOST/MAIL_USER/MAIL_PASS');
      return; // ✅ transporter يبقى undefined
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
    });
  }
  async sendWelcome(email: string, name?: string) {
  if (!this.transporter) {
    // إذا SMTP موش مهيّأ
    return;
  }

  const from = process.env.MAIL_FROM || process.env.MAIL_USER;

  await this.transporter.sendMail({
    from,
    to: email,
    subject: 'Welcome to InterimAI',
    text: `Welcome ${name ?? ''}! Your account has been created.`,
    html: `<h2>Welcome ${name ?? ''}!</h2><p>Your account has been created successfully.</p>`,
  });
}


  async sendOtp(email: string, code: string) {
    if (!this.transporter) {
      throw new BadRequestException('SMTP not configured (MAIL_* env missing)');
    }

    const from = process.env.MAIL_FROM || process.env.MAIL_USER;

    await this.transporter.sendMail({
      from,
      to: email,
      subject: 'InterimAI - Verification Code',
      text: `Your verification code is: ${code} (valid 10 minutes)`,
      html: `<p>Your verification code is: <b>${code}</b> (valid 10 minutes)</p>`,
    });
  }
}
