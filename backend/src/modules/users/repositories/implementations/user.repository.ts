import { IUserRepository } from '../interfaces/user.repository.interface';
import { UserModel } from '../../../../models/user.model';
import { UserDto } from '../../dtos/user.dto';
import { UserMapper } from '../../mappers/user.mapper';
import { injectable } from 'inversify';

@injectable()
export class MongooseUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserDto | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? UserMapper.toDto(doc) : null;
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? UserMapper.toDto(doc) : null;
  }

  async findByUsername(username: string): Promise<UserDto | null> {
    const doc = await UserModel.findOne({ username }).exec();
    return doc ? UserMapper.toDto(doc) : null;
  }

  async create(user: Partial<UserDto>): Promise<UserDto> {
    const created = await UserModel.create({
      name: user.name,
      username: user.username ?? undefined,
      email: user.email,
      password: user.passwordHash ?? undefined,
      isPasswordSet: user.isPasswordSet,
      role: user.role,
      isActive: user.isActive,
      location: user.location,
    });
    return UserMapper.toDto(created);
  }

  async update(id: string, data: Partial<UserDto>): Promise<UserDto> {
    const updateFields: Record<string, unknown> = {};
    if (data.name !== undefined) updateFields.name = data.name;
    if (data.username !== undefined) updateFields.username = data.username ?? undefined;
    if (data.email !== undefined) updateFields.email = data.email;
    if (data.passwordHash !== undefined) updateFields.password = data.passwordHash ?? undefined;
    if (data.isPasswordSet !== undefined) updateFields.isPasswordSet = data.isPasswordSet;
    if (data.role !== undefined) updateFields.role = data.role;
    if (data.isActive !== undefined) updateFields.isActive = data.isActive;
    if (data.location !== undefined) updateFields.location = data.location;

    const updated = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    ).exec();

    if (!updated) throw new Error('User not found');
    return UserMapper.toDto(updated);
  }
}
