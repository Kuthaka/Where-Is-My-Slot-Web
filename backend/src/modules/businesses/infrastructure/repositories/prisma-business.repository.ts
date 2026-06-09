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

  async create(business: Business): Promise<Business> {
    const created = await this.prisma.business.create({
      data: {
        id: business.id,
        ownerId: business.ownerId,
        name: business.name,
        description: business.description,
        email: business.email,
        phone: business.phone,
        address: business.address,
        latitude: business.latitude,
        longitude: business.longitude,
        timings: business.timings,
        parking: business.parking,
        images: business.images,
        isVerified: business.isVerified,
      },
    });
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<Business>): Promise<Business> {
    const updated = await this.prisma.business.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        email: data.email,
        phone: data.phone,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        timings: data.timings,
        parking: data.parking,
        images: data.images,
        isVerified: data.isVerified,
      },
    });
    return this.mapToDomain(updated);
  }

  private mapToDomain(prismaBusiness: any): Business {
    return new Business(
      prismaBusiness.id,
      prismaBusiness.ownerId,
      prismaBusiness.name,
      prismaBusiness.description,
      prismaBusiness.email,
      prismaBusiness.phone,
      prismaBusiness.address,
      prismaBusiness.latitude,
      prismaBusiness.longitude,
      prismaBusiness.timings,
      prismaBusiness.parking,
      prismaBusiness.images,
      prismaBusiness.isVerified,
      prismaBusiness.createdAt,
      prismaBusiness.updatedAt,
    );
  }
}
