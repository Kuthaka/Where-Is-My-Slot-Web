import { Otp } from '../entities/otp.entity';

export const OTP_REPOSITORY = Symbol('OTP_REPOSITORY');

export interface IOtpRepository {
  create(otp: Otp): Promise<Otp>;
  findLatestValidOtp(email: string, otp: string): Promise<Otp | null>;
  delete(id: string): Promise<void>;
}
