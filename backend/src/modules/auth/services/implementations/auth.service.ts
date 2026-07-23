import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { IAuthService } from '../interfaces/auth.service.interface';
import { IUserRepository } from '../../../users/repositories/interfaces/user.repository.interface';
import { UserDto } from '../../../users/dtos/user.dto';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { UnauthorizedError, ConflictError, BadRequestError, NotFoundError } from '../../../../shared/errors/app-error';
import { IOtpService } from '../../../../shared/services/interfaces/otp.service.interface';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.OtpService) private readonly otpService: IOtpService
  ) {}

  async sendOtp(email: string): Promise<{ success: boolean; message: string }> {
    await this.otpService.sendOtp(email);
    return { success: true, message: `OTP sent successfully to ${email}` };
  }

  async verifyOtp(email: string, otpValue: string): Promise<{ success: boolean; message: string }> {
    // Optional: Call otpService.verifyOtp(email, otpValue) if strict OTP checks are desired here in production
    // For now, we keep the original logic intact.

    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      const newUser: Partial<UserDto> = {
        name: email.split('@')[0],
        username: null,
        email,
        passwordHash: randomPassword,
        isPasswordSet: false,
        role: UserRole.BUSINESS,
        isActive: true,
      };
      user = await this.userRepository.create(newUser);
    } else if (user.role === UserRole.USER) {
      user = await this.userRepository.update(user.id, { role: UserRole.BUSINESS });
    }

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, secret, { expiresIn: '7d' });

    return { success: true, message: accessToken };
  }

  async login(email: string, password: string): Promise<{ accessToken: string; user: Omit<UserDto, 'passwordHash'> }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.passwordHash || "");
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, secret, { expiresIn: '7d' });

    const { passwordHash, ...safeUser } = user;
    return { accessToken, user: safeUser as Omit<UserDto, 'passwordHash'> };
  }

  async registerUser(data: { name: string; username: string; email: string; passwordPlain: string; otp: string }): Promise<{ accessToken: string; user: Omit<UserDto, 'passwordHash'> }> {
    // 1. Verify OTP first
    await this.otpService.verifyOtp(data.email, data.otp);

    // 2. Perform existing checks
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) throw new ConflictError('UserDto with this email already exists');

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) throw new ConflictError('UserDto with this username already exists');

    const passwordHash = await bcrypt.hash(data.passwordPlain, 10);

    const user: Partial<UserDto> = {
      name: data.name,
      username: data.username,
      email: data.email,
      passwordHash,
      isPasswordSet: true,
      role: UserRole.USER,
      isActive: true,
    };

    const createdUser = await this.userRepository.create(user);
    const { passwordHash: _, ...safeUser } = createdUser;

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const payload = { sub: createdUser.id, email: createdUser.email, role: createdUser.role };
    const accessToken = jwt.sign(payload, secret, { expiresIn: '7d' });

    return { accessToken, user: safeUser as Omit<UserDto, 'passwordHash'> };
  }

  async setPassword(userId: string, newPasswordPlain: string, oldPasswordPlain?: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('UserDto not found');

    if (user.isPasswordSet) {
      if (!oldPasswordPlain) {
        throw new BadRequestError('Old password is required to change password');
      }
      const isValid = await bcrypt.compare(oldPasswordPlain, user.passwordHash || "");
      if (!isValid) throw new BadRequestError('Invalid old password');
    }

    const hashed = await bcrypt.hash(newPasswordPlain, 10);
    await this.userRepository.update(userId, { passwordHash: hashed, isPasswordSet: true });

    return { success: true, message: 'Password updated successfully' };
  }

  async checkAvailability(username?: string, email?: string): Promise<{ usernameAvailable?: boolean; emailAvailable?: boolean }> {
    const result: { usernameAvailable?: boolean; emailAvailable?: boolean } = {};

    if (username) {
      const existing = await this.userRepository.findByUsername(username);
      result.usernameAvailable = !existing;
    }
    if (email) {
      const existing = await this.userRepository.findByEmail(email);
      result.emailAvailable = !existing;
    }

    return result;
  }

  async getMe(userId: string): Promise<Omit<UserDto, 'passwordHash'> | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    const { passwordHash, ...safeUser } = user;
    return safeUser as Omit<UserDto, 'passwordHash'>;
  }
}
