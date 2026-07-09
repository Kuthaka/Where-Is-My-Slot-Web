import { Injectable } from '@nestjs/common';
import { IBusinessRepository } from '../../domain/repositories/business.repository.interface';
import { Business as BusinessEntity } from '../../domain/entities/business.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Business } from '../../../../models/business.schema';

@Injectable()
export class MongooseBusinessRepository implements IBusinessRepository {
  constructor(@InjectModel(Business.name) private readonly businessModel: Model<Business>) {}

  async findById(id: string): Promise<BusinessEntity | null> {
    const business = await this.businessModel.findById(id).exec();
    if (!business) return null;
    return this.mapToDomain(business);
  }

  async findByOwnerId(ownerId: string): Promise<BusinessEntity[]> {
    const businesses = await this.businessModel.find({ ownerId }).exec();
    return businesses.map(b => this.mapToDomain(b));
  }

  async findByUsername(username: string): Promise<BusinessEntity | null> {
    const business = await this.businessModel.findOne({ username }).exec();
    if (!business) return null;
    return this.mapToDomain(business);
  }

  async create(business: BusinessEntity): Promise<BusinessEntity> {
    const propsToSave: any = { ...business.props };
    if (!propsToSave.ownerId) delete propsToSave.ownerId; // Fix null to undefined
    const created = await this.businessModel.create(propsToSave as any);
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<BusinessEntity>): Promise<BusinessEntity> {
    // data might be Partial<BusinessEntity> or Partial<BusinessProps> depending on how they call it,
    // let's safely handle it
    const updateData = (data as any).props || data;
    const updated = await this.businessModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).exec();
    if (!updated) throw new Error('Business not found');
    return this.mapToDomain(updated);
  }

  async findAll(): Promise<BusinessEntity[]> {
    const businesses = await this.businessModel.find().exec();
    return businesses.map(b => this.mapToDomain(b));
  }

  private mapToDomain(mongooseBusiness: any): BusinessEntity {
    const props = {
      id: mongooseBusiness._id.toString(),
      ownerId: mongooseBusiness.ownerId?.toString() || null,
      name: mongooseBusiness.name,
      username: mongooseBusiness.username,
      tagline: mongooseBusiness.tagline,
      description: mongooseBusiness.description,
      establishedYear: mongooseBusiness.establishedYear,
      gstNumber: mongooseBusiness.gstNumber,
      contactPerson: mongooseBusiness.contactPerson,
      phone: mongooseBusiness.phone,
      email: mongooseBusiness.email,
      websiteUrl: mongooseBusiness.websiteUrl,
      whatsappNumber: mongooseBusiness.whatsappNumber,
      mobileNumbers: mongooseBusiness.mobileNumbers,
      landlineNumbers: mongooseBusiness.landlineNumbers,
      emails: mongooseBusiness.emails,
      address: mongooseBusiness.address,
      pincode: mongooseBusiness.pincode,
      plotNo: mongooseBusiness.plotNo,
      buildingName: mongooseBusiness.buildingName,
      streetName: mongooseBusiness.streetName,
      landmark: mongooseBusiness.landmark,
      area: mongooseBusiness.area,
      city: mongooseBusiness.city,
      state: mongooseBusiness.state,
      latitude: mongooseBusiness.latitude,
      longitude: mongooseBusiness.longitude,
      googleMapsUrl: mongooseBusiness.googleMapsUrl,
      timings: mongooseBusiness.timings,
      primaryCategory: mongooseBusiness.primaryCategory,
      subCategories: mongooseBusiness.subCategories,
      amenities: mongooseBusiness.amenities,
      parking: mongooseBusiness.parking,
      logo: mongooseBusiness.logo,
      coverPhoto: mongooseBusiness.coverPhoto,
      images: mongooseBusiness.images,
      socialLinks: mongooseBusiness.socialLinks,
      isVerified: mongooseBusiness.isVerified,
      status: mongooseBusiness.status,
      createdAt: mongooseBusiness.createdAt,
      updatedAt: mongooseBusiness.updatedAt,
    };
    return new BusinessEntity(props);
  }
}
