// ─── OTP Domain Entity ─────────────────────────────────────────────────────────

export class Otp {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly otpValue: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date
  ) {}
}
