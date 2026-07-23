import { BusinessDto } from '../../../../dtos/business/business.dto';

export interface IBusinessAuthService {
  login(data: any): Promise<{ business: BusinessDto; accessToken: string }>;
  setPassword(businessId: string, data: any): Promise<void>;
  sendOtp(email: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<{ message: string }>;
}
