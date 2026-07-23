import { BusinessDto } from '../../../../dtos/business/business.dto';
import { IExploreBusinessesFilters, IExploreBusinessesResult } from '../../repositories/business/business.repository.interface';

export interface IBusinessesService {
  exploreBusinesses(filters: IExploreBusinessesFilters): Promise<IExploreBusinessesResult>;
  getBusinessById(id: string): Promise<BusinessDto | null>;
  getMyBusiness(userId: string, isBusinessUser: boolean): Promise<BusinessDto | null>;
  updateMyBusiness(userId: string, isBusinessUser: boolean, data: Record<string, any>): Promise<BusinessDto>;
  onboardBusiness(data: Record<string, unknown>): Promise<{ business: BusinessDto; accessToken: string }>;
  businessLogin(data: Record<string, unknown>): Promise<{ business: BusinessDto; accessToken: string }>;
  businessSetPassword(userId: string, data: Record<string, unknown>): Promise<void>;
  uploadImage(fileBuffer: Buffer): Promise<string>;
  businessSendOtp(email: string): Promise<void>;
  businessVerifyOtp(email: string, otp: string): Promise<{ verified: boolean; verifiedToken: string }>;
}
