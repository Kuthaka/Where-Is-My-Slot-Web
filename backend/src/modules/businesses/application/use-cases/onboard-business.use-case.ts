import { Injectable, Inject } from '@nestjs/common';
import { IBusinessRepository, BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository.interface';
import { Business } from '../../domain/entities/business.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OnboardBusinessUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
  ) {}

  async execute(data: any): Promise<Business> {
    const business = new Business({
      id: uuidv4(),
      ownerId: data.ownerId || null,
      name: data.name,
      username: data.username || null,
      tagline: data.tagline || null,
      description: data.description || null,
      establishedYear: data.establishedYear || null,
      gstNumber: data.gstNumber || null,
      contactPerson: data.contactPerson || null,
      phone: data.phone || null,
      email: data.email || null,
      websiteUrl: data.websiteUrl || null,
      whatsappNumber: data.whatsappNumber || null,
      mobileNumbers: data.mobileNumbers || [],
      landlineNumbers: data.landlineNumbers || [],
      emails: data.emails || [],
      address: data.address || null,
      pincode: data.pincode || null,
      plotNo: data.plotNo || null,
      buildingName: data.buildingName || null,
      streetName: data.streetName || null,
      landmark: data.landmark || null,
      area: data.area || null,
      city: data.city || null,
      state: data.state || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      googleMapsUrl: data.googleMapsUrl || null,
      timings: data.timings || null,
      primaryCategory: data.primaryCategory || null,
      subCategories: data.subCategories || [],
      amenities: data.amenities || [],
      parking: data.parking || null,
      logo: data.logo || null,
      coverPhoto: data.coverPhoto || null,
      images: data.images || [],
      socialLinks: data.socialLinks || null,
      isVerified: true,
      status: 'APPROVED',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.businessRepository.create(business);
  }
}
