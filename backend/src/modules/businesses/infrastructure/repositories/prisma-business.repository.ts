import { Injectable } from '@nestjs/common';
import { IBusinessRepository } from '../../domain/repositories/business.repository.interface';
import { Business } from '../../domain/entities/business.entity';
import { PrismaService } from '../../../../shared/database/prisma.service';

@Injectable()
export class PrismaBusinessRepository implements IBusinessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Business | null> {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) return null;
    return this.mapToDomain(business);
  }

  async findByOwnerId(ownerId: string): Promise<Business[]> {
    const businesses = await this.prisma.business.findMany({ where: { ownerId } });
    return businesses.map(b => this.mapToDomain(b));
  }

  async findAll(): Promise<Business[]> {
    const businesses = await this.prisma.business.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return businesses.map(b => this.mapToDomain(b));
  }

  async create(business: Business): Promise<Business> {
    const created = await this.prisma.business.create({
      data: {
        ...business.props
      },
    });
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<Business>): Promise<Business> {
    // We only update the props that are passed
    const updateData = data.props ? { ...data.props } : {};
    const updated = await this.prisma.business.update({
      where: { id },
      data: updateData,
    });
    return this.mapToDomain(updated);
  }

  private mapToDomain(prismaBusiness: any): Business {
    return new Business({
      id: prismaBusiness.id,
      ownerId: prismaBusiness.ownerId,
      name: prismaBusiness.name,
      username: prismaBusiness.username,
      tagline: prismaBusiness.tagline,
      description: prismaBusiness.description,
      establishedYear: prismaBusiness.establishedYear,
      gstNumber: prismaBusiness.gstNumber,
      contactPerson: prismaBusiness.contactPerson,
      phone: prismaBusiness.phone,
      email: prismaBusiness.email,
      websiteUrl: prismaBusiness.websiteUrl,
      whatsappNumber: prismaBusiness.whatsappNumber,
      mobileNumbers: prismaBusiness.mobileNumbers,
      landlineNumbers: prismaBusiness.landlineNumbers,
      emails: prismaBusiness.emails,
      address: prismaBusiness.address,
      pincode: prismaBusiness.pincode,
      plotNo: prismaBusiness.plotNo,
      buildingName: prismaBusiness.buildingName,
      streetName: prismaBusiness.streetName,
      landmark: prismaBusiness.landmark,
      area: prismaBusiness.area,
      city: prismaBusiness.city,
      state: prismaBusiness.state,
      latitude: prismaBusiness.latitude,
      longitude: prismaBusiness.longitude,
      googleMapsUrl: prismaBusiness.googleMapsUrl,
      timings: prismaBusiness.timings,
      primaryCategory: prismaBusiness.primaryCategory,
      subCategories: prismaBusiness.subCategories,
      amenities: prismaBusiness.amenities,
      parking: prismaBusiness.parking,
      logo: prismaBusiness.logo,
      coverPhoto: prismaBusiness.coverPhoto,
      images: prismaBusiness.images,
      socialLinks: prismaBusiness.socialLinks,
      isVerified: prismaBusiness.isVerified,
      status: prismaBusiness.status,
      createdAt: prismaBusiness.createdAt,
      updatedAt: prismaBusiness.updatedAt,
    });
  }
}
