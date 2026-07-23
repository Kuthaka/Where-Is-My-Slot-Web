import { BusinessDto } from '../../../../dtos/business/business.dto';

export interface IAdminService {
  getAllBusinesses(): Promise<BusinessDto[]>;
  approveBusiness(id: string): Promise<BusinessDto>;
  rejectBusiness(id: string): Promise<BusinessDto>;
  createAdminBusiness(data: Record<string, unknown>): Promise<BusinessDto>;
}
