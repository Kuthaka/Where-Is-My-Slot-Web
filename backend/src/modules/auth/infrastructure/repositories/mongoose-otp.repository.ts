import { Injectable } from '@nestjs/common';
import { IOtpRepository } from '../../domain/repositories/otp.repository.interface';
import { Otp as OtpEntity } from '../../domain/entities/otp.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp } from '../../../../models/otp.schema';

@Injectable()
export class MongooseOtpRepository implements IOtpRepository {
  constructor(@InjectModel(Otp.name) private readonly otpModel: Model<Otp>) {}

  async create(otp: OtpEntity): Promise<OtpEntity> {
    const created = await this.otpModel.create({
      email: otp.email,
      otp: otp.otp,
      expiresAt: otp.expiresAt,
    });
    return this.mapToDomain(created);
  }

  async findLatestValidOtp(email: string, otp: string): Promise<OtpEntity | null> {
    const record = await this.otpModel
      .findOne({ email, otp })
      .sort({ createdAt: -1 })
      .exec();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async delete(id: string): Promise<void> {
    await this.otpModel.findByIdAndDelete(id).exec();
  }

  private mapToDomain(mongooseOtp: any): OtpEntity {
    return new OtpEntity(
      mongooseOtp._id.toString(),
      mongooseOtp.email,
      mongooseOtp.otp,
      mongooseOtp.expiresAt,
      mongooseOtp.createdAt,
    );
  }
}
