import { Business } from '../entities/business.entity';

export const BUSINESS_REPOSITORY = Symbol('BUSINESS_REPOSITORY');

export interface IBusinessRepository {
  findById(id: string): Promise<Business | null>;
  findByOwnerId(ownerId: string): Promise<Business[]>;
  findAll(): Promise<Business[]>;
  create(business: Business): Promise<Business>;
  update(id: string, data: Partial<Business>): Promise<Business>;
}
