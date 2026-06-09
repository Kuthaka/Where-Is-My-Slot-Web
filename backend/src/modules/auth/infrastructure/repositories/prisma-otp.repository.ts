import { Injectable } from '@nestjs/common';
import { IOtpRepository } from '../../domain/repositories/otp.repository.interface';
import { Otp } from '../../domain/entities/otp.entity';
import { PrismaService } from '../../../../shared/database/prisma.service';

@Injectable()
export class PrismaOtpRepository implements IOtpRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(otp: Otp): Promise<Otp> {
    const created = await this.prisma.otp.create({
      data: {
        id: otp.id,
        email: otp.email,
        otp: otp.otp,
        expiresAt: otp.expiresAt,
      },
    });
    return this.mapToDomain(created);
  }

  async findLatestValidOtp(email: string, otp: string): Promise<Otp | null> {
    const record = await this.prisma.otp.findFirst({
      where: { email, otp },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.otp.delete({ where: { id } });
  }

  private mapToDomain(prismaOtp: any): Otp {
    return new Otp(
      prismaOtp.id,
      prismaOtp.email,
      prismaOtp.otp,
      prismaOtp.expiresAt,
      prismaOtp.createdAt,
    );
  }
}
