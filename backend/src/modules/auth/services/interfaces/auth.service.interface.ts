import { UserDto } from '../../../users/dtos/user.dto';
import { Otp } from '../../entities/otp.entity';

export interface IAuthService {
  sendOtp(email: string): Promise<{ success: boolean; message: string }>;
  verifyOtp(email: string, otpValue: string): Promise<{ success: boolean; message: string }>;
  login(email: string, password: string): Promise<{ accessToken: string; user: Omit<UserDto, 'passwordHash'> }>;
  registerUser(data: { name: string; username: string; email: string; passwordPlain: string; otp: string }): Promise<{ accessToken: string; user: Omit<UserDto, 'passwordHash'> }>;
  setPassword(userId: string, newPassword: string, oldPassword?: string): Promise<{ success: boolean; message: string }>;
  checkAvailability(username?: string, email?: string): Promise<{ usernameAvailable?: boolean; emailAvailable?: boolean }>;
  getMe(userId: string): Promise<Omit<UserDto, 'passwordHash'> | null>;
}
