import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../shared/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(email: string) {
    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.otp.create({
      data: { email, otp, expiresAt },
    });

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Verification Code',
        html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
      });
    } catch (e) {
      console.error('Failed to send email:', e);
      // We don't throw error to allow local testing if SMTP fails
    }

    return { message: 'OTP sent successfully to ' + email };
  }

  async verifyOtp(email: string, otp: string) {
    const record = await this.prisma.otp.findFirst({
      where: { email, otp },
      orderBy: { createdAt: 'desc' },
    });

    if (!record || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Delete the OTP record so it can't be reused
    await this.prisma.otp.delete({ where: { id: record.id } });

    // Check if user exists, otherwise create
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create user
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await this.prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
          password: randomPassword,
          role: UserRole.BUSINESS,
        },
      });
    } else {
      // Ensure role is BUSINESS or SUPER_ADMIN
      if (user.role === UserRole.USER) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { role: UserRole.BUSINESS },
        });
      }
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
