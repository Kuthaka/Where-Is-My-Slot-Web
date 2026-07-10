import { Business } from '../../entities/business.entity';

export interface IBusinessesService {
  onboardBusiness(data: Record<string, unknown>): Promise<Business>;
  updateBusiness(ownerId: string, data: Record<string, unknown>): Promise<Business>;
}
