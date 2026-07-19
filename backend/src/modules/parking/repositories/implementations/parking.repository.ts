import { injectable } from 'inversify';
import { IParkingRepository } from '../interfaces/parking.repository.interface';
import { ParkingModel, IParkingDocument } from '../../../../models/parking.model';

@injectable()
export class ParkingRepository implements IParkingRepository {
  async create(data: Partial<IParkingDocument>): Promise<IParkingDocument> {
    return ParkingModel.create(data);
  }

  async findById(id: string): Promise<IParkingDocument | null> {
    return ParkingModel.findById(id).populate('businessId', 'name logo coverPhoto isVerified');
  }

  async findByBusinessId(businessId: string): Promise<IParkingDocument[]> {
    return ParkingModel.find({ businessId }).sort({ createdAt: -1 });
  }

  async update(id: string, data: Partial<IParkingDocument>): Promise<IParkingDocument | null> {
    return ParkingModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await ParkingModel.findByIdAndDelete(id);
    return !!result;
  }

  async findNearby(lat: number, lng: number, maxDistance: number, query: any = {}): Promise<IParkingDocument[]> {
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
    return ParkingModel.find(geoQuery).populate('businessId', 'name logo isVerified');
  }
}
