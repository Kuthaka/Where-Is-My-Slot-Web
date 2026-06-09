import { Injectable, Inject } from '@nestjs/common';
import { IBusinessRepository, BUSINESS_REPOSITORY } from '../../domain/repositories/business.repository.interface';
import { Business } from '../../domain/entities/business.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OnboardBusinessUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
  ) {}

  async execute(data: {
    ownerId: string;
    name: string;
    description?: string;
    email: string;
    phone: string;
    address: string;
    timings?: any;
    parking?: any;
    images: string[];
  }): Promise<Business> {
    const business = new Business(
      uuidv4(),
      data.ownerId,
      data.name,
      data.description || null,
      data.email,
      data.phone,
      data.address,
      null, // latitude
      null, // longitude
      data.timings,
      data.parking,
      data.images,
      false, // isVerified
      new Date(),
      new Date(),
    );

    return this.businessRepository.create(business);
  }
}
