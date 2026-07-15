import { injectable, inject } from 'inversify';
import { ILocationService } from '../interfaces/location.service.interface';
import { TYPES } from '../../../../core/container/types';
import { IUserRepository } from '../../../users/repositories/interfaces/user.repository.interface';
import { NotFoundError } from '../../../../shared/errors/app-error';

@injectable()
export class LocationService implements ILocationService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository
  ) {}

  async searchLocation(query: string): Promise<Array<{ address: string; latitude: number; longitude: number }>> {
    // Note: OpenStreetMap Nominatim is used here as a free geocoding provider.
    // For a production app, Google Maps Places API is recommended.
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'WhereIsMySlot-Backend/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }

      const data = (await response.json()) as any[];
      return data.map((item: any) => ({
        address: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }));
    } catch (error) {
      console.error('[LocationService] Search failed:', error);
      return [];
    }
  }

  async setUserLocation(userId: string, address: string, latitude: number, longitude: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.userRepository.update(userId, {
      location: { address, latitude, longitude }
    });
  }
}
