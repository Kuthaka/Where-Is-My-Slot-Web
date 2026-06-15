import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../../shared/database/prisma.service';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.passwordHash,
        isPasswordSet: user.isPasswordSet,
        role: user.role as any,
        isActive: user.isActive,
      },
    });
    return this.mapToDomain(created);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.passwordHash,
        isPasswordSet: data.isPasswordSet,
        role: data.role as any,
        isActive: data.isActive,
      },
    });
    return this.mapToDomain(updated);
  }

  private mapToDomain(prismaUser: any): User {
    return new User(
      prismaUser.id,
      prismaUser.name,
      prismaUser.username,
      prismaUser.email,
      prismaUser.password,
      prismaUser.isPasswordSet,
      prismaUser.role,
      prismaUser.isActive,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}
