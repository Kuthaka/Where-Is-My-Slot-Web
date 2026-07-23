export interface ParkingDto {
  id: string;
  name: string;
  description?: string;
  source: 'BUSINESS' | 'COMMUNITY';
  businessId?: string;
  submittedBy?: string;
  location: {
    type: string;
    coordinates: number[]; // [longitude, latitude]
  };
  address: string;
  city: string;
  pricingType: 'FREE' | 'PAID' | 'CUSTOM';
  pricingDetails?: string;
  type: string[];
  features: string[];
  images: string[];
  slots: {
    car: { total: number; occupied: number };
    bike: { total: number; occupied: number };
    ev: { total: number; occupied: number };
  };
  status: 'ACTIVE' | 'PENDING' | 'REJECTED' | 'CLOSED';
  workingHours?: Record<string, { open: string; close: string }>;
  createdAt: Date;
  updatedAt: Date;
}
