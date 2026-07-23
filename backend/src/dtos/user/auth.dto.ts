import { z } from 'zod';

export const SendOtpDtoSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const VerifyOtpDtoSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be exactly 6 characters'),
});

export const LoginDtoSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const RegisterDtoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  otp: z.string().length(6, 'OTP must be exactly 6 characters'),
});

export const SetPasswordDtoSchema = z.object({
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  oldPassword: z.string().optional(),
});

export type SendOtpDto = z.infer<typeof SendOtpDtoSchema>;
export type VerifyOtpDto = z.infer<typeof VerifyOtpDtoSchema>;
export type LoginDto = z.infer<typeof LoginDtoSchema>;
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
export type SetPasswordDto = z.infer<typeof SetPasswordDtoSchema>;
