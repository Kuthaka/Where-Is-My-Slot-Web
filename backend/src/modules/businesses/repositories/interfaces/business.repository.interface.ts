import { Business } from '../../entities/business.entity';

// ─── Business Repository Interface ────────────────────────────────────────────

export interface IBusinessRepository {
  findById(id: string): Promise<Business | null>;
  findByOwnerId(ownerId: string): Promise<Business[]>;
  findByUsername(username: string): Promise<Business | null>;
  findByContactEmail(email: string): Promise<Business | null>;
  findAll(): Promise<Business[]>;
  create(business: Business): Promise<Business>;
  update(id: string, data: Partial<Business>): Promise<Business>;
}
