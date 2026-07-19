import { IParkingDocument } from '../../../../models/parking.model';

export interface IParkingRepository {
  create(data: Partial<IParkingDocument>): Promise<IParkingDocument>;
  findById(id: string): Promise<IParkingDocument | null>;
  findByBusinessId(businessId: string): Promise<IParkingDocument[]>;
  update(id: string, data: Partial<IParkingDocument>): Promise<IParkingDocument | null>;
  delete(id: string): Promise<boolean>;
  findNearby(lat: number, lng: number, maxDistance: number, query?: any): Promise<IParkingDocument[]>;
}
