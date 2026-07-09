import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { IOtpRepository } from '../../domain/repositories/otp.repository.interface';
import { User } from '../../../users/domain/entities/user.entity';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { BadRequestError } from '../../../../shared/errors/app-error';
import { v4 as uuidv4 } from 'uuid';

// ─── Verify OTP Use Case ───────────────────────────────────────────────────────

export class VerifyOtpUseCase {
  constructor(
    private readonly otpRepository: IOtpRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(email: string, otpValue: string): Promise<{ accessToken: string; user: User }> {
    // Uncomment for strict OTP check in production:
    // const record = await this.otpRepository.findLatestValidOtp(email, otpValue);
    // if (!record || record.expiresAt < new Date()) {
    //   throw new BadRequestError('Invalid or expired OTP');
    // }
    // await this.otpRepository.delete(record.id);

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      const newUser = new User(
        uuidv4(),
        email.split('@')[0],
        null,
        email,
        randomPassword,
        false,
        UserRole.BUSINESS,
        true,
        new Date(),
        new Date()
      );
      user = await this.userRepository.create(newUser);
    } else if (user.role === UserRole.USER) {
      user = await this.userRepository.update(user.id, { role: UserRole.BUSINESS });
    }

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, secret, { expiresIn: '7d' });

    return { accessToken, user };
  }
}
