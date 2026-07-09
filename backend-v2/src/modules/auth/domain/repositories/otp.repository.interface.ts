import { Otp } from '../entities/otp.entity';

// ─── OTP Repository Interface ──────────────────────────────────────────────────

export interface IOtpRepository {
  create(otp: Otp): Promise<Otp>;
  findLatestValidOtp(email: string, otpValue: string): Promise<Otp | null>;
  delete(id: string): Promise<void>;
}
