import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User as UserEntity } from '../../domain/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../../models/user.schema';

@Injectable()
export class MongooseUserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await this.userModel.create({
      name: user.name,
      username: user.username || undefined,
      email: user.email,
      password: user.passwordHash || undefined,
      isPasswordSet: user.isPasswordSet,
      role: user.role,
      isActive: user.isActive,
    });
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const updated = await this.userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name: data.name,
          username: data.username === null ? undefined : data.username,
          email: data.email,
          password: data.passwordHash === null ? undefined : data.passwordHash,
          isPasswordSet: data.isPasswordSet,
          role: data.role,
          isActive: data.isActive,
        },
      },
      { new: true }
    ).exec();
    if (!updated) throw new Error('User not found');
    return this.mapToDomain(updated);
  }

  private mapToDomain(mongooseUser: any): UserEntity {
    return new UserEntity(
      mongooseUser._id.toString(),
      mongooseUser.name,
      mongooseUser.username,
      mongooseUser.email,
      mongooseUser.password,
      mongooseUser.isPasswordSet,
      mongooseUser.role,
      mongooseUser.isActive,
      mongooseUser.createdAt,
      mongooseUser.updatedAt,
    );
  }
}
