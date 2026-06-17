import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { BUSINESS_REPOSITORY, IBusinessRepository } from '../../domain/repositories/business.repository.interface';
import { UpdateBusinessDto } from '../dto/update-business.dto';

@Injectable()
export class UpdateBusinessUseCase {
  constructor(
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
  ) {}

  async execute(ownerId: string, data: UpdateBusinessDto) {
    const businesses = await this.businessRepository.findByOwnerId(ownerId);
    if (businesses.length === 0) {
      throw new NotFoundException('Business not found for the current user');
    }
    
    const business = businesses[0];
    
    // Convert DTO to entity update payload wrapped in props for the repository
    const updateData: any = { ...data };
    
    const updatedBusiness = await this.businessRepository.update(business.props.id, { props: updateData } as any);
    return updatedBusiness;
  }
}
