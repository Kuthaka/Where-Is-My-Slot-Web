export class Otp {
  constructor(
    public readonly id: string,
    public email: string,
    public otp: string,
    public expiresAt: Date,
    public createdAt: Date,
  ) {}
}
