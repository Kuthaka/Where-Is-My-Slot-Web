import { BusinessDto } from '../../dtos/business.dto';

// ─── Business Repository Interface ────────────────────────────────────────────

export interface IExploreBusinessesFilters {
  search?: string;
  category?: string;
  city?: string;
  cursor?: string;
  limit?: number;
}

export interface IExploreBusinessesResult {
  businesses: BusinessDto[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface IBusinessRepository {
  findById(id: string): Promise<BusinessDto | null>;
  findByOwnerId(ownerId: string): Promise<BusinessDto[]>;
  findByUsername(username: string): Promise<BusinessDto | null>;
  findByContactEmail(email: string): Promise<BusinessDto | null>;
  findAll(): Promise<BusinessDto[]>;
  create(business: Partial<BusinessDto>): Promise<BusinessDto>;
  update(id: string, data: Partial<BusinessDto>): Promise<BusinessDto>;
  exploreBusinesses(filters: IExploreBusinessesFilters): Promise<IExploreBusinessesResult>;
}
