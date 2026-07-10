import { IBusinessesService } from '../interfaces/businesses.service.interface';
import { IBusinessRepository } from '../../repositories/interfaces/business.repository.interface';
import { Business } from '../../entities/business.entity';
import { NotFoundError } from '../../../../shared/errors/app-error';
import { v4 as uuidv4 } from 'uuid';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class BusinessesService implements IBusinessesService {
  constructor(
    @inject(TYPES.BusinessRepository) private readonly businessRepository: IBusinessRepository
  ) {}

  async onboardBusiness(data: Record<string, unknown>): Promise<Business> {
    const business = new Business({
      id: uuidv4(),
      ownerId: (data.ownerId as string) ?? null,
      name: data.name as string,
      username: (data.username as string) || undefined,
      tagline: (data.tagline as string) ?? null,
      description: (data.description as string) ?? null,
      establishedYear: (data.establishedYear as number) ?? null,
      gstNumber: (data.gstNumber as string) ?? null,
      contactPerson: (data.contactPerson as string) ?? null,
      phone: (data.phone as string) ?? null,
      email: (data.email as string) ?? null,
      websiteUrl: (data.websiteUrl as string) ?? null,
      whatsappNumber: (data.whatsappNumber as string) ?? null,
      mobileNumbers: (data.mobileNumbers as string[]) ?? [],
      landlineNumbers: (data.landlineNumbers as string[]) ?? [],
      emails: (data.emails as string[]) ?? [],
      address: (data.address as string) ?? null,
      pincode: (data.pincode as string) ?? null,
      plotNo: (data.plotNo as string) ?? null,
      buildingName: (data.buildingName as string) ?? null,
      streetName: (data.streetName as string) ?? null,
      landmark: (data.landmark as string) ?? null,
      area: (data.area as string) ?? null,
      city: (data.city as string) ?? null,
      state: (data.state as string) ?? null,
      latitude: (data.latitude as number) ?? null,
      longitude: (data.longitude as number) ?? null,
      googleMapsUrl: (data.googleMapsUrl as string) ?? null,
      timings: (data.timings as Record<string, unknown>) ?? null,
      primaryCategory: (data.primaryCategory as string) ?? null,
      subCategories: (data.subCategories as string[]) ?? [],
      amenities: (data.amenities as string[]) ?? [],
      parking: (data.parking as Record<string, unknown>) ?? null,
      logo: (data.logo as string) ?? null,
      coverPhoto: (data.coverPhoto as string) ?? null,
      images: (data.images as string[]) ?? [],
      socialLinks: (data.socialLinks as Record<string, unknown>) ?? null,
      isVerified: true,
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.businessRepository.create(business);
  }

  async updateBusiness(ownerId: string, data: Record<string, unknown>): Promise<Business> {
    const businesses = await this.businessRepository.findByOwnerId(ownerId);
    if (businesses.length === 0) {
      throw new NotFoundError('Business not found for the current user');
    }

    const business = businesses[0];
    const updateData = { props: { ...data } };

    return this.businessRepository.update(business.props.id, updateData as any);
  }
}
