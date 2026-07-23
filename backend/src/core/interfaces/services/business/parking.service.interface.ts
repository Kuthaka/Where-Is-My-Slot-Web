import { ParkingDto } from '../../../../dtos/business/parking.dto';

export interface IParkingService {
  createBusinessParking(userId: string, isBusinessUser: boolean, data: Partial<ParkingDto>): Promise<ParkingDto>;
  createCommunityParking(userId: string, data: Partial<ParkingDto>): Promise<ParkingDto>;
  getParkingById(id: string): Promise<ParkingDto>;
  getBusinessParking(userId: string, isBusinessUser: boolean): Promise<ParkingDto[]>;
  updateParking(id: string, userId: string, isBusinessUser: boolean, data: Partial<ParkingDto>): Promise<ParkingDto>;
  deleteParking(id: string, userId: string, isBusinessUser: boolean): Promise<boolean>;
  findNearbyParking(lat: number, lng: number, radius: number, filters?: any): Promise<ParkingDto[]>;
  updateAvailability(id: string, userId: string, isBusinessUser: boolean, slots: any): Promise<ParkingDto>;
}
