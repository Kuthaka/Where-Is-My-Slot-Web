import { IAdminService } from '../interfaces/admin.service.interface';
import { IBusinessRepository } from '../../../businesses/repositories/interfaces/business.repository.interface';
import { BusinessDto } from '../../../businesses/dtos/business.dto';
import { NotFoundError } from '../../../../shared/errors/app-error';
import { v4 as uuidv4 } from 'uuid';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.BusinessRepository) private readonly businessRepository: IBusinessRepository
  ) {}

  async getAllBusinesses(): Promise<BusinessDto[]> {
    return this.businessRepository.findAll();
  }

  async approveBusiness(id: string): Promise<BusinessDto> {
    const business = await this.businessRepository.findById(id);
    if (!business) throw new NotFoundError('BusinessDto not found');

    business.status = 'APPROVED';
    business.isVerified = true;

    return this.businessRepository.update(id, business);
  }

  async rejectBusiness(id: string): Promise<BusinessDto> {
    const business = await this.businessRepository.findById(id);
    if (!business) throw new NotFoundError('BusinessDto not found');

    business.status = 'REJECTED';
    business.isVerified = false;

    return this.businessRepository.update(id, business);
  }

  async createAdminBusiness(data: Record<string, unknown>): Promise<BusinessDto> {
    const business: Partial<BusinessDto> = {
      id: uuidv4(),
      ownerId: (data.ownerId as string) ?? null,
      contactEmail: (data.contactEmail as string) ?? (data.email as string) ?? '',
      passwordHash: null,
      isPasswordSet: false,
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
    };

    return this.businessRepository.create(business);
  }
}
