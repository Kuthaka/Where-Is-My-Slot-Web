import { injectable, inject } from 'inversify';
import { IParkingService } from '../interfaces/parking.service.interface';
import { IParkingRepository } from '../../repositories/interfaces/parking.repository.interface';
import { IParkingDocument } from '../../../../models/parking.model';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../../../../shared/errors/app-error';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class ParkingService implements IParkingService {
  constructor(
    @inject(TYPES.ParkingRepository) private parkingRepository: IParkingRepository
  ) {}

  async createBusinessParking(businessId: string, data: Partial<IParkingDocument>): Promise<IParkingDocument> {
    const payload = {
      ...data,
      source: 'BUSINESS' as const,
      businessId,
      status: 'ACTIVE' as const
    };
    return this.parkingRepository.create(payload);
  }

  async createCommunityParking(userId: string, data: Partial<IParkingDocument>): Promise<IParkingDocument> {
    const payload = {
      ...data,
      source: 'COMMUNITY' as const,
      submittedBy: userId,
      status: 'PENDING' as const
    };
    return this.parkingRepository.create(payload);
  }

  async getParkingById(id: string): Promise<IParkingDocument> {
    const parking = await this.parkingRepository.findById(id);
    if (!parking) throw new NotFoundError('Parking not found');
    return parking;
  }

  async getBusinessParking(businessId: string): Promise<IParkingDocument[]> {
    return this.parkingRepository.findByBusinessId(businessId);
  }

  async updateParking(id: string, businessId: string, data: Partial<IParkingDocument>): Promise<IParkingDocument> {
    const parking = await this.parkingRepository.findById(id);
    if (!parking) throw new NotFoundError('Parking not found');
    
    // Ensure the business owns the parking
    if (parking.businessId?.toString() !== businessId) {
      throw new UnauthorizedError('Not authorized to update this parking space');
    }

    const updated = await this.parkingRepository.update(id, data);
    if (!updated) throw new NotFoundError('Parking not found');
    return updated;
  }

  async updateAvailability(id: string, businessId: string, slots: any): Promise<IParkingDocument> {
    const parking = await this.parkingRepository.findById(id);
    if (!parking) throw new NotFoundError('Parking not found');
    
    if (parking.businessId?.toString() !== businessId) {
      throw new UnauthorizedError('Not authorized to update this parking space');
    }

    // Validate bounds: occupied cannot exceed total or drop below 0
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

  async deleteParking(id: string, businessId: string): Promise<boolean> {
    const parking = await this.parkingRepository.findById(id);
    if (!parking) throw new NotFoundError('Parking not found');
    
    if (parking.businessId?.toString() !== businessId) {
      throw new UnauthorizedError('Not authorized to delete this parking space');
    }

    return this.parkingRepository.delete(id);
  }

  async findNearbyParking(lat: number, lng: number, radius: number = 5000, filters: any = {}): Promise<IParkingDocument[]> {
    const query: any = {};
    if (filters.isFree) query.pricingType = 'FREE';
    if (filters.type) query.type = { $in: [filters.type] };
    if (filters.source) query.source = filters.source;
    
    return this.parkingRepository.findNearby(lat, lng, radius, query);
  }
}
