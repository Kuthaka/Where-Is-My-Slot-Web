export interface IOtpService {
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otpValue: string): Promise<void>;
}
