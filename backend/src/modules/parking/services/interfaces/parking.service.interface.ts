import { IParkingDocument } from '../../../../models/parking.model';

export interface IParkingService {
  createBusinessParking(businessId: string, data: Partial<IParkingDocument>): Promise<IParkingDocument>;
  createCommunityParking(userId: string, data: Partial<IParkingDocument>): Promise<IParkingDocument>;
  getParkingById(id: string): Promise<IParkingDocument>;
  getBusinessParking(businessId: string): Promise<IParkingDocument[]>;
  updateParking(id: string, businessId: string, data: Partial<IParkingDocument>): Promise<IParkingDocument>;
  deleteParking(id: string, businessId: string): Promise<boolean>;
  findNearbyParking(lat: number, lng: number, radius: number, filters?: any): Promise<IParkingDocument[]>;
  updateAvailability(id: string, businessId: string, slots: any): Promise<IParkingDocument>;
}
