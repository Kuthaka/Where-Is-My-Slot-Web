import { IUserRepository } from '../interfaces/user.repository.interface';
import { User } from '../../entities/user.entity';
import { UserModel, IUserDocument } from '../../../../models/user.model';

// ─── Mongoose User Repository ──────────────────────────────────────────────────

import { injectable } from 'inversify';

@injectable()
export class MongooseUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const doc = await UserModel.findOne({ username }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async create(user: User): Promise<User> {
    const created = await UserModel.create({
      name: user.name,
      username: user.username ?? undefined,
      email: user.email,
      password: user.passwordHash ?? undefined,
      isPasswordSet: user.isPasswordSet,
      role: user.role,
      isActive: user.isActive,
    });
    return this.toDomain(created);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updateFields: Record<string, unknown> = {};
    if (data.name !== undefined) updateFields.name = data.name;
    if (data.username !== undefined) updateFields.username = data.username ?? undefined;
    if (data.email !== undefined) updateFields.email = data.email;
    if (data.passwordHash !== undefined) updateFields.password = data.passwordHash ?? undefined;
    if (data.isPasswordSet !== undefined) updateFields.isPasswordSet = data.isPasswordSet;
    if (data.role !== undefined) updateFields.role = data.role;
    if (data.isActive !== undefined) updateFields.isActive = data.isActive;

    const updated = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).exec();

    if (!updated) throw new Error('User not found');
    return this.toDomain(updated);
  }

  private toDomain(doc: IUserDocument): User {
    return new User(
      doc._id.toString(),
      doc.name,
      doc.username ?? null,
      doc.email,
      doc.password ?? '',
      doc.isPasswordSet,
      doc.role,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
