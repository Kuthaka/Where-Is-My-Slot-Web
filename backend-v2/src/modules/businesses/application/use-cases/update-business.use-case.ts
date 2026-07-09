import { IBusinessRepository } from '../../domain/repositories/business.repository.interface';
import { Business } from '../../domain/entities/business.entity';
import { NotFoundError } from '../../../../shared/errors/app-error';

// ─── Update Business Use Case ──────────────────────────────────────────────────

export class UpdateBusinessUseCase {
  constructor(private readonly businessRepository: IBusinessRepository) {}

  async execute(ownerId: string, data: Record<string, unknown>): Promise<Business> {
    const businesses = await this.businessRepository.findByOwnerId(ownerId);
    if (businesses.length === 0) {
      throw new NotFoundError('Business not found for the current user');
    }

    const business = businesses[0];
    const updateData = { props: { ...data } };

    return this.businessRepository.update(business.props.id, updateData as any);
  }
}
