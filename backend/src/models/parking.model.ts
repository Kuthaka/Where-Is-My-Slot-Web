import mongoose, { Schema, Document } from 'mongoose';

export interface IParkingDocument extends Document {
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
  type: string[]; // e.g., VALET, COVERED, OPEN
  features: string[]; // e.g., CCTV, EV_CHARGING
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

const ParkingSchema = new Schema<IParkingDocument>(
  {
    name: { type: String, required: true },
    description: String,
    
    source: { type: String, enum: ['BUSINESS', 'COMMUNITY'], required: true },
    businessId: { type: Schema.Types.ObjectId as unknown as typeof String, ref: 'Business' },
    submittedBy: { type: Schema.Types.ObjectId as unknown as typeof String, ref: 'User' },
    
    location: {
      type: { type: String, enum: ['Point'], required: true, default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, required: true },
    city: { type: String, required: true },

    pricingType: { type: String, enum: ['FREE', 'PAID', 'CUSTOM'], required: true },
    pricingDetails: String,
    type: { type: [String], default: [] },
    features: { type: [String], default: [] },
    images: { type: [String], default: [] },

    slots: {
      car: {
        total: { type: Number, default: 0 },
        occupied: { type: Number, default: 0 },
      },
      bike: {
        total: { type: Number, default: 0 },
        occupied: { type: Number, default: 0 },
      },
      ev: {
        total: { type: Number, default: 0 },
        occupied: { type: Number, default: 0 },
      }
    },

    status: { type: String, enum: ['ACTIVE', 'PENDING', 'REJECTED', 'CLOSED'], default: 'ACTIVE' },
    workingHours: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes for spatial search and fast lookup
ParkingSchema.index({ location: '2dsphere' });
ParkingSchema.index({ businessId: 1 });
ParkingSchema.index({ city: 1 });
ParkingSchema.index({ source: 1, status: 1 });

export const ParkingModel = mongoose.model<IParkingDocument>('Parking', ParkingSchema);
