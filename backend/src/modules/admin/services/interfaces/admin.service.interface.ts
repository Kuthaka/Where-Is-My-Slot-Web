import { Business } from '../../../businesses/entities/business.entity';

export interface IAdminService {
  getAllBusinesses(): Promise<Business[]>;
  approveBusiness(id: string): Promise<Business>;
  rejectBusiness(id: string): Promise<Business>;
  createAdminBusiness(data: Record<string, unknown>): Promise<Business>;
}
