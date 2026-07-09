import { IOtpRepository } from '../../domain/repositories/otp.repository.interface';
import { Otp } from '../../domain/entities/otp.entity';
import { sendOtpEmail } from '../../../../infrastructure/services/email.service';
import { v4 as uuidv4 } from 'uuid';

// ─── Send OTP Use Case ─────────────────────────────────────────────────────────

export class SendOtpUseCase {
  constructor(
    private readonly otpRepository: IOtpRepository,
  ) {}

  async execute(email: string): Promise<{ message: string }> {
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const otp = new Otp(uuidv4(), email, otpValue, expiresAt, new Date());
    await this.otpRepository.create(otp);

    await sendOtpEmail(email, otpValue);

    return { message: `OTP sent successfully to ${email}` };
  }
}
