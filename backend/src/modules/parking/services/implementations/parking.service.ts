import { injectable, inject } from 'inversify';
import { IParkingService } from '../interfaces/parking.service.interface';
import { IParkingRepository } from '../../repositories/interfaces/parking.repository.interface';
import { IBusinessRepository } from '../../../businesses/repositories/interfaces/business.repository.interface';
import { ParkingDto } from '../../dtos/parking.dto';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../../../../shared/errors/app-error';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class ParkingService implements IParkingService {
  constructor(
    @inject(TYPES.ParkingRepository) private parkingRepository: IParkingRepository,
    @inject(TYPES.BusinessRepository) private businessRepository: IBusinessRepository
  ) {}

  private async getBusinessIdForUser(userId: string, isBusinessUser: boolean): Promise<string> {
    if (isBusinessUser) {
      return userId;
    }
    const businesses = await this.businessRepository.findByOwnerId(userId);
    if (!businesses.length) throw new BadRequestError('User does not own a business');
    return businesses[0].id;
  }

  async createBusinessParking(userId: string, isBusinessUser: boolean, data: Partial<ParkingDto>): Promise<ParkingDto> {
    const businessId = await this.getBusinessIdForUser(userId, isBusinessUser);
    const payload = {
      ...data,
      source: 'BUSINESS' as const,
      businessId,
      status: 'ACTIVE' as const
    };
    return this.parkingRepository.create(payload);
  }

  async createCommunityParking(userId: string, data: Partial<ParkingDto>): Promise<ParkingDto> {
    const payload = {
      ...data,
      source: 'COMMUNITY' as const,
      submittedBy: userId,
      status: 'PENDING' as const
    };
    return this.parkingRepository.create(payload);
  }

  async getParkingById(id: string): Promise<ParkingDto> {
    const parking = await this.parkingRepository.findById(id);
    if (!parking) throw new NotFoundError('Parking not found');
    return parking;
  }

  async getBusinessParking(userId: string, isBusinessUser: boolean): Promise<ParkingDto[]> {
    const businessId = await this.getBusinessIdForUser(userId, isBusinessUser);
    return this.parkingRepository.findByBusinessId(businessId);
  }

  async updateParking(id: string, userId: string, isBusinessUser: boolean, data: Partial<ParkingDto>): Promise<ParkingDto> {
    const businessId = await this.getBusinessIdForUser(userId, isBusinessUser);
    const parking = await this.parkingRepository.findById(id);
    if (!parking) throw new NotFoundError('Parking not found');
    
    if (parking.businessId?.toString() !== businessId) {
      throw new UnauthorizedError('Not authorized to update this parking space');
    }

    const updated = await this.parkingRepository.update(id, data);
    if (!updated) throw new NotFoundError('Parking not found');
    return updated;
  }

  async updateAvailability(id: string, userId: string, isBusinessUser: boolean, slots: any): Promise<ParkingDto> {
    const businessId = await this.getBusinessIdForUser(userId, isBusinessUser);
    const parking = await this.parkingRepository.findById(id);
    if (!parking) throw new NotFoundError('Parking not found');
    
    if (parking.businessId?.toString() !== businessId) {
      throw new UnauthorizedError('Not authorized to update this parking space');
    }

    ['car', 'bike', 'ev'].forEach(type => {
      if (slots[type] && slots[type].occupied !== undefined) {
        const total = parking.slots[type as keyof typeof parking.slots].total;
        if (slots[type].occupied > total || slots[type].occupied < 0) {
          throw new BadRequestError(`Invalid occupied count for ${type}. Must be between 0 and ${total}`);
        }
      }
    });

    const updated = await this.parkingRepository.update(id, { slots: { ...parking.slots, ...slots } });
    if (!updated) throw new NotFoundError('Parking not found');
    return updated;
  }

  async deleteParking(id: string, userId: string, isBusinessUser: boolean): Promise<boolean> {
    const businessId = await this.getBusinessIdForUser(userId, isBusinessUser);
    const parking = await this.parkingRepository.findById(id);
    if (!parking) throw new NotFoundError('Parking not found');
    
    if (parking.businessId?.toString() !== businessId) {
      throw new UnauthorizedError('Not authorized to delete this parking space');
    }

    return this.parkingRepository.delete(id);
  }

  async findNearbyParking(lat: number, lng: number, radius: number = 5000, filters: any = {}): Promise<ParkingDto[]> {
    const query: any = {};
    if (filters.isFree) query.pricingType = 'FREE';
    if (filters.type) query.type = { $in: [filters.type] };
    if (filters.source) query.source = filters.source;
    
    return this.parkingRepository.findNearby(lat, lng, radius, query);
  }
}
