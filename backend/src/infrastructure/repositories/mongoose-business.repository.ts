import { IBusinessRepository } from '../../modules/businesses/domain/repositories/business.repository.interface';
import { Business, BusinessProps } from '../../modules/businesses/domain/entities/business.entity';
import { BusinessModel, IBusinessDocument } from '../database/models/business.model';

// ─── Mongoose Business Repository ─────────────────────────────────────────────

export class MongooseBusinessRepository implements IBusinessRepository {
  async findById(id: string): Promise<Business | null> {
    const doc = await BusinessModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByOwnerId(ownerId: string): Promise<Business[]> {
    const docs = await BusinessModel.find({ ownerId }).exec();
    return docs.map((d) => this.toDomain(d));
  }

  async findByUsername(username: string): Promise<Business | null> {
    const doc = await BusinessModel.findOne({ username }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(): Promise<Business[]> {
    const docs = await BusinessModel.find().exec();
    return docs.map((d) => this.toDomain(d));
  }

  async create(business: Business): Promise<Business> {
    const propsToSave: Record<string, unknown> = { ...business.props };
    if (!propsToSave.ownerId) delete propsToSave.ownerId;
    delete propsToSave.id; // Let MongoDB generate the _id

    const created = await BusinessModel.create(propsToSave);
    return this.toDomain(created);
  }

  async update(id: string, data: Partial<Business>): Promise<Business> {
    // Support both passing raw props and a Business entity
    const updateData = (data as any).props || data;
    delete updateData.id;

    const updated = await BusinessModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).exec();

    if (!updated) throw new Error('Business not found');
    return this.toDomain(updated);
  }

  private toDomain(doc: IBusinessDocument): Business {
    const props: BusinessProps = {
      id: doc._id.toString(),
      ownerId: (doc.ownerId?.toString()) ?? null,
      name: doc.name,
      username: doc.username ?? null,
      tagline: doc.tagline ?? null,
      description: doc.description ?? null,
      establishedYear: doc.establishedYear ?? null,
      gstNumber: doc.gstNumber ?? null,
      contactPerson: doc.contactPerson ?? null,
      phone: doc.phone ?? null,
      email: doc.email ?? null,
      websiteUrl: doc.websiteUrl ?? null,
      whatsappNumber: doc.whatsappNumber ?? null,
      mobileNumbers: doc.mobileNumbers ?? [],
      landlineNumbers: doc.landlineNumbers ?? [],
      emails: doc.emails ?? [],
      address: doc.address ?? null,
      pincode: doc.pincode ?? null,
      plotNo: doc.plotNo ?? null,
      buildingName: doc.buildingName ?? null,
      streetName: doc.streetName ?? null,
      landmark: doc.landmark ?? null,
      area: doc.area ?? null,
      city: doc.city ?? null,
      state: doc.state ?? null,
      latitude: doc.latitude ?? null,
      longitude: doc.longitude ?? null,
      googleMapsUrl: doc.googleMapsUrl ?? null,
      timings: doc.timings ?? null,
      primaryCategory: doc.primaryCategory ?? null,
      subCategories: doc.subCategories ?? [],
      amenities: doc.amenities ?? [],
      parking: doc.parking ?? null,
      logo: doc.logo ?? null,
      coverPhoto: doc.coverPhoto ?? null,
      images: doc.images ?? [],
      socialLinks: doc.socialLinks ?? null,
      isVerified: doc.isVerified,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    return new Business(props);
  }
}
