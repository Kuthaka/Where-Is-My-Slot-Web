export interface ILocationService {
  searchLocation(query: string): Promise<Array<{ address: string; latitude: number; longitude: number }>>;
  setUserLocation(userId: string, address: string, latitude: number, longitude: number): Promise<void>;
}
