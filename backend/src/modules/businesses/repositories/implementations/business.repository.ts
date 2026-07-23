import { IBusinessRepository, IExploreBusinessesFilters, IExploreBusinessesResult } from '../interfaces/business.repository.interface';
import { BusinessDto } from '../../dtos/business.dto';
import { BusinessMapper } from '../../mappers/business.mapper';
import { BusinessModel, IBusinessDocument } from '../../../../models/business.model';
import { Types } from 'mongoose';

// ─── Mongoose Business Repository ─────────────────────────────────────────────

import { injectable } from 'inversify';

@injectable()
export class MongooseBusinessRepository implements IBusinessRepository {
  async findById(id: string): Promise<BusinessDto | null> {
    const doc = await BusinessModel.findById(id).exec();
    return doc ? BusinessMapper.toDto(doc) : null;
  }

  async findByOwnerId(ownerId: string): Promise<BusinessDto[]> {
    const docs = await BusinessModel.find({ ownerId }).exec();
    return docs.map((d: any) => BusinessMapper.toDto(d));
  }

  async findByUsername(username: string): Promise<BusinessDto | null> {
    const doc = await BusinessModel.findOne({ username }).exec();
    return doc ? BusinessMapper.toDto(doc) : null;
  }

  async findByContactEmail(email: string): Promise<BusinessDto | null> {
    const doc = await BusinessModel.findOne({ contactEmail: email }).exec();
    return doc ? BusinessMapper.toDto(doc) : null;
  }

  async findAll(): Promise<BusinessDto[]> {
    const docs = await BusinessModel.find().exec();
    return docs.map((d: any) => BusinessMapper.toDto(d));
  }

  async create(business: Partial<BusinessDto>): Promise<BusinessDto> {
    const propsToSave: Record<string, unknown> = { ...business };
    if (!propsToSave.ownerId) delete propsToSave.ownerId;
    if (!propsToSave.username) delete propsToSave.username;
    delete propsToSave.id; // Let MongoDB generate the _id

    const created = await BusinessModel.create(propsToSave);
    return BusinessMapper.toDto(created);
  }

  async update(id: string, data: Partial<BusinessDto>): Promise<BusinessDto> {
    // Support both passing raw props and a Business entity
    const updateData = { ...data };
    delete updateData.id;

    const query: any = { $set: updateData };
    if (updateData.username === null || updateData.username === '') {
      delete updateData.username;
      query.$unset = { username: 1 };
    }

    const updated = await BusinessModel.findByIdAndUpdate(
      id,
      query,
      { new: true }
    ).exec();

    if (!updated) throw new Error('Business not found');
    return BusinessMapper.toDto(updated);
  }

  async exploreBusinesses(filters: IExploreBusinessesFilters): Promise<IExploreBusinessesResult> {
    const { search, category, city, cursor, limit } = filters;
    const take = limit ? Math.min(limit, 20) : 12;
    const where: Record<string, unknown> = { status: 'APPROVED' };

    if (city) {
      where.city = { $regex: city, $options: 'i' };
    }

    if (search) {
      where.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { area: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { primaryCategory: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (category && category !== 'All') {
      where.primaryCategory = { $regex: category, $options: 'i' };
    }
    
    if (cursor) {
      where._id = { $lt: new Types.ObjectId(cursor) };
    }

    const businesses = await BusinessModel.find(where)
      .sort({ isVerified: -1, createdAt: -1 })
      .limit(take + 1)
      .exec();

    const hasMore = businesses.length > take;
    const items = hasMore ? businesses.slice(0, take) : businesses;
    const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

    return {
      businesses: items.map((d: any) => BusinessMapper.toDto(d)),
      nextCursor,
      hasMore,
    };
  }

}
