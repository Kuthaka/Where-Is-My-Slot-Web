import mongoose, { Schema, Document } from 'mongoose';

// ─── Business Mongoose Schema ──────────────────────────────────────────────────

export interface IBusinessDocument extends Document {
  ownerId?: string;
  // ─── Merchant Auth Fields ──────────────────────────────────
  contactEmail: string;      // primary login email for merchant
  passwordHash?: string;     // hashed password for dashboard login
  isPasswordSet: boolean;    // true once merchant sets their password
  // ───────────────────────────────────────────────────────────
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
  country?: string;
  latitude?: number;
  longitude?: number;
  googleMapsUrl?: string;
  timings?: Record<string, unknown>;
  primaryCategory?: string;
  subCategories: string[];
  amenities: string[];
  parking?: Record<string, unknown>;
  petPolicy?: string;
  seating: string[];
  paymentModes: string[];
  logo?: string;
  coverPhoto?: string;
  images: string[];
  videos: string[];
  menus: string[];
  services: Record<string, unknown>[];
  products: Record<string, unknown>[];
  socialLinks?: Record<string, unknown>;
  businessRegistrationProof?: string;
  ownerIdProof?: string;
  isVerified: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusinessDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId as unknown as typeof String, ref: 'User', index: true },
    // Merchant auth fields
    contactEmail: { type: String, required: true, unique: true },
    passwordHash: { type: String },
    isPasswordSet: { type: Boolean, default: false },
    // Business profile
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
    primaryCategory: { type: String },
    subCategories: [{ type: String }],
    amenities: [{ type: String }],
    parking: { type: Schema.Types.Mixed },
    petPolicy: { type: String },
    seating: [{ type: String }],
    paymentModes: [{ type: String }],
    // Rich media
    logo: { type: String },
    coverPhoto: { type: String },
    images: [{ type: String }],
    videos: [{ type: String }],
    // Services / Products
    menus: [{ type: String }],
    services: [{ type: Schema.Types.Mixed }],
    products: [{ type: Schema.Types.Mixed }],
    socialLinks: { type: Schema.Types.Mixed },
    // Verification
    businessRegistrationProof: { type: String },
    ownerIdProof: { type: String },
    isVerified: { type: Boolean, default: false },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  },
  { timestamps: true }
);

export const BusinessModel = mongoose.model<IBusinessDocument>('Business', BusinessSchema);
