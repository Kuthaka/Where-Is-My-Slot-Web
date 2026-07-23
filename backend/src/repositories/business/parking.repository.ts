import { injectable } from 'inversify';
import { IParkingRepository } from '../../core/interfaces/repositories/business/parking.repository.interface';
import { ParkingModel } from '../../models/parking.model';
import { ParkingDto } from '../../dtos/business/parking.dto';
import { ParkingMapper } from '../../mappers/business/parking.mapper';

@injectable()
export class ParkingRepository implements IParkingRepository {
  async create(data: Partial<ParkingDto>): Promise<ParkingDto> {
    const doc = await ParkingModel.create(data);
    return ParkingMapper.toDto(doc);
  }

  async findById(id: string): Promise<ParkingDto | null> {
    const doc = await ParkingModel.findById(id).populate('businessId', 'name logo coverPhoto isVerified');
    return doc ? ParkingMapper.toDto(doc) : null;
  }

  async findByBusinessId(businessId: string): Promise<ParkingDto[]> {
    const docs = await ParkingModel.find({ businessId }).sort({ createdAt: -1 });
    return docs.map((d: any) => ParkingMapper.toDto(d));
  }

  async update(id: string, data: Partial<ParkingDto>): Promise<ParkingDto | null> {
    const doc = await ParkingModel.findByIdAndUpdate(id, { $set: data }, { new: true });
    return doc ? ParkingMapper.toDto(doc) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ParkingModel.findByIdAndDelete(id);
    return !!result;
  }

  async findNearby(lat: number, lng: number, maxDistance: number, query: any = {}): Promise<ParkingDto[]> {
    const geoQuery = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          $maxDistance: maxDistance // in meters
        }
      },
      status: 'ACTIVE',
      ...query
    };
    const docs = await ParkingModel.find(geoQuery).populate('businessId', 'name logo isVerified');
    return docs.map((d: any) => ParkingMapper.toDto(d));
  }
}
