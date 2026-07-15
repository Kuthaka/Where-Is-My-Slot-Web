import { User } from '../../../users/entities/user.entity';
import { Otp } from '../../entities/otp.entity';

export interface IAuthService {
  sendOtp(email: string): Promise<{ success: boolean; message: string }>;
  verifyOtp(email: string, otpValue: string): Promise<{ success: boolean; message: string }>;
  login(email: string, password: string): Promise<{ accessToken: string; user: Omit<User, 'passwordHash'> }>;
  registerUser(data: { name: string; username: string; email: string; passwordPlain: string; otp: string }): Promise<{ accessToken: string; user: Omit<User, 'passwordHash'> }>;
  setPassword(userId: string, newPassword: string, oldPassword?: string): Promise<{ success: boolean; message: string }>;
}
