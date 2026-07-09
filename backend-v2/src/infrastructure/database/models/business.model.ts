import mongoose, { Schema, Document } from 'mongoose';

// ─── Business Mongoose Schema ──────────────────────────────────────────────────

export interface IBusinessDocument extends Document {
  ownerId?: string;
  name: string;
  username?: string;
  tagline?: string;
  description?: string;
  establishedYear?: number;
  gstNumber?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  whatsappNumber?: string;
  mobileNumbers: string[];
  landlineNumbers: string[];
  emails: string[];
  address?: string;
  pincode?: string;
  plotNo?: string;
  buildingName?: string;
  streetName?: string;
  landmark?: string;
  area?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  timings?: Record<string, unknown>;
  primaryCategory?: string;
  subCategories: string[];
  amenities: string[];
  parking?: Record<string, unknown>;
  logo?: string;
  coverPhoto?: string;
  images: string[];
  socialLinks?: Record<string, unknown>;
  isVerified: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusinessDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId as unknown as typeof String, ref: 'User', index: true },
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    tagline: String,
    description: String,
    establishedYear: Number,
    gstNumber: String,
    contactPerson: String,
    phone: String,
    email: String,
    websiteUrl: String,
    whatsappNumber: String,
    mobileNumbers: { type: [String], default: [] },
    landlineNumbers: { type: [String], default: [] },
    emails: { type: [String], default: [] },
    address: String,
    pincode: String,
    plotNo: String,
    buildingName: String,
    streetName: String,
    landmark: String,
    area: String,
    city: String,
    state: String,
    latitude: Number,
    longitude: Number,
    googleMapsUrl: String,
    timings: { type: Schema.Types.Mixed },
    primaryCategory: String,
    subCategories: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    parking: { type: Schema.Types.Mixed },
    logo: String,
    coverPhoto: String,
    images: { type: [String], default: [] },
    socialLinks: { type: Schema.Types.Mixed },
    isVerified: { type: Boolean, default: false },
    status: { type: String, default: 'PENDING' },
  },
  { timestamps: true }
);

export const BusinessModel = mongoose.model<IBusinessDocument>('Business', BusinessSchema);
