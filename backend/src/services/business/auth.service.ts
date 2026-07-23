import { IBusinessAuthService } from '../../core/interfaces/services/business/auth.service.interface';
import { IBusinessRepository } from '../../core/interfaces/repositories/business/business.repository.interface';
import { IUserRepository } from '../../core/interfaces/repositories/user/user.repository.interface';
import { IOtpService } from '../../shared/services/interfaces/otp.service.interface';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../shared/errors/app-error';
import { BusinessDto } from '../../dtos/business/business.dto';
import { UserRole } from '../../shared/enums/user-role.enum';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/container/types';

@injectable()
export class BusinessAuthService implements IBusinessAuthService {
  constructor(
    @inject(TYPES.BusinessRepository) private readonly businessRepository: IBusinessRepository,
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.OtpService) private readonly otpService: IOtpService
  ) {}

  async login(data: Record<string, unknown>): Promise<{ business: BusinessDto; accessToken: string }> {
    const email = data.email as string;
    const password = data.password as string;

    if (!email || !password) throw new BadRequestError('Email and password are required');

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('No account found with this email');
    
    if (user.role !== UserRole.BUSINESS && user.role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedError('This account is not a business account.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash || "");
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const businesses = await this.businessRepository.findByOwnerId(user.id);
    if (businesses.length === 0) {
      throw new NotFoundError('No business profile is associated with this account.');
    }
    const business = businesses[0];

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, type: 'business' },
      secret,
      { expiresIn: '7d' }
    );

    return { business, accessToken };
  }

  async setPassword(userId: string, data: Record<string, unknown>): Promise<void> {
    const newPassword = data.newPassword as string;
    const oldPassword = data.oldPassword as string;

    if (!newPassword) throw new BadRequestError('New password is required');

    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    if (user.isPasswordSet) {
      if (!oldPassword) throw new BadRequestError('Old password is required');
      const isValid = await bcrypt.compare(oldPassword, user.passwordHash || "");
      if (!isValid) throw new BadRequestError('Old password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, {
      passwordHash,
      isPasswordSet: true,
    });
  }

  async sendOtp(email: string): Promise<void> {
    if (!email) throw new BadRequestError('Email is required');
    await this.otpService.sendOtp(email);
  }

  async verifyOtp(email: string, otp: string): Promise<{ message: string; verifiedToken?: string }> {
    if (!email || !otp) throw new BadRequestError('Email and OTP are required');

    await this.otpService.verifyOtp(email, otp);

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const verifiedToken = jwt.sign(
      { email, type: 'business-otp-verified' },
      secret,
      { expiresIn: '2h' }
    );

    return { message: 'OTP verified successfully', verifiedToken };
  }
}
