import { ParkingDto } from '../../dtos/parking.dto';

export interface IParkingRepository {
  create(data: Partial<ParkingDto>): Promise<ParkingDto>;
  findById(id: string): Promise<ParkingDto | null>;
  findByBusinessId(businessId: string): Promise<ParkingDto[]>;
  update(id: string, data: Partial<ParkingDto>): Promise<ParkingDto | null>;
  delete(id: string): Promise<boolean>;
  findNearby(lat: number, lng: number, maxDistance: number, query?: any): Promise<ParkingDto[]>;
}
