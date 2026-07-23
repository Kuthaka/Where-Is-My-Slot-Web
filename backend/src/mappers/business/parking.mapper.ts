import { IParkingDocument } from '../../models/parking.model';
import { ParkingDto } from '../../dtos/business/parking.dto';

export class ParkingMapper {
  static toDto(doc: IParkingDocument): ParkingDto {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      source: doc.source,
      businessId: doc.businessId ? doc.businessId.toString() : undefined,
      submittedBy: doc.submittedBy ? doc.submittedBy.toString() : undefined,
      location: {
        type: doc.location.type,
        coordinates: doc.location.coordinates,
      },
      address: doc.address,
      city: doc.city,
      pricingType: doc.pricingType,
      pricingDetails: doc.pricingDetails,
      type: doc.type || [],
      features: doc.features || [],
      images: doc.images || [],
      slots: doc.slots,
      status: doc.status,
      workingHours: doc.workingHours,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
