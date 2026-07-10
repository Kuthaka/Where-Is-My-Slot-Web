import { IOtpRepository } from '../interfaces/otp.repository.interface';
import { Otp } from '../../entities/otp.entity';
import { OtpModel, IOtpDocument } from '../../../../models/misc.model';

export class MongooseOtpRepository implements IOtpRepository {
  async create(otp: Otp): Promise<Otp> {
    const created = await OtpModel.create({
      email: otp.email,
      otp: otp.otpValue,
      expiresAt: otp.expiresAt,
    });
    return this.toDomain(created);
  }

  async findLatestValidOtp(email: string, otpValue: string): Promise<Otp | null> {
    const doc = await OtpModel.findOne({
      email,
      otp: otpValue,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .exec();
    return doc ? this.toDomain(doc) : null;
  }

  async delete(id: string): Promise<void> {
    await OtpModel.findByIdAndDelete(id).exec();
  }

  private toDomain(doc: IOtpDocument): Otp {
    return new Otp(doc._id.toString(), doc.email, doc.otp, doc.expiresAt, doc.createdAt);
  }
}
