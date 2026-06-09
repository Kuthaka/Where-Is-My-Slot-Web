import { Injectable, Inject } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IOtpRepository, OTP_REPOSITORY } from '../../domain/repositories/otp.repository.interface';
import { Otp } from '../../domain/entities/otp.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SendOtpUseCase {
  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otpRepository: IOtpRepository,
    private readonly mailerService: MailerService,
  ) {}

  async execute(email: string) {
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const otp = new Otp(uuidv4(), email, otpValue, expiresAt, new Date());
    await this.otpRepository.create(otp);

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Your Verification Code',
        html: `<p>Your verification code is: <strong>${otpValue}</strong></p><p>It expires in 10 minutes.</p>`,
      });
    } catch (e) {
      console.error('Failed to send email:', e);
    }

    return { message: 'OTP sent successfully to ' + email };
  }
}
