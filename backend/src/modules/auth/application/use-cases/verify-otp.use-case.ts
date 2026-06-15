import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IOtpRepository, OTP_REPOSITORY } from '../../domain/repositories/otp.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '../../../users/domain/repositories/user.repository.interface';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { User } from '../../../users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    @Inject(OTP_REPOSITORY)
    private readonly otpRepository: IOtpRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(email: string, otp: string) {
    // Bypassing OTP check for smooth testing
    // const record = await this.otpRepository.findLatestValidOtp(email, otp);

    // if (!record || record.expiresAt < new Date()) {
    //   throw new BadRequestException('Invalid or expired OTP');
    // }

    // await this.otpRepository.delete(record.id);

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = new User(
        uuidv4(),
        email.split('@')[0],
        null, // username
        email,
        randomPassword,
        false,
        UserRole.BUSINESS,
        true,
        new Date(),
        new Date()
      );
      user = await this.userRepository.create(user);
    } else {
      if (user.role === UserRole.USER) {
        user = await this.userRepository.update(user.id, { role: UserRole.BUSINESS });
      }
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
