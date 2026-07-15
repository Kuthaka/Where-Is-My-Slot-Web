import { injectable, inject } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { IOtpService } from '../interfaces/otp.service.interface';
import { IOtpRepository } from '../../../modules/auth/repositories/interfaces/otp.repository.interface';
import { TYPES } from '../../../core/container/types';
import { Otp } from '../../../modules/auth/entities/otp.entity';
import { sendOtpEmail } from '../email.service';
import { BadRequestError } from '../../errors/app-error';

@injectable()
export class OtpService implements IOtpService {
  constructor(
    @inject(TYPES.OtpRepository) private readonly otpRepository: IOtpRepository
  ) {}

  async sendOtp(email: string): Promise<void> {
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log(`\n=========================================\n[OTP GENERATED] Email: ${email} | Code: ${otpValue}\n=========================================\n`);

    const otp = new Otp(uuidv4(), email, otpValue, expiresAt, new Date());
    await this.otpRepository.create(otp);

    await sendOtpEmail(email, otpValue);
  }

  async verifyOtp(email: string, otpValue: string): Promise<void> {
    const record = await this.otpRepository.findLatestValidOtp(email, otpValue);
    if (!record) {
      throw new BadRequestError('Invalid or expired OTP. Please request a new one.');
    }
    // Delete the OTP so it cannot be reused
    await this.otpRepository.delete(record.id);
  }
}
