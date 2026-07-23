import { BusinessDto } from '../../../businesses/dtos/business.dto';

export interface IAdminService {
  getAllBusinesses(): Promise<BusinessDto[]>;
  approveBusiness(id: string): Promise<BusinessDto>;
  rejectBusiness(id: string): Promise<BusinessDto>;
  createAdminBusiness(data: Record<string, unknown>): Promise<BusinessDto>;
}
