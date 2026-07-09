import mongoose, { Schema, Document } from 'mongoose';

// ─── OTP Mongoose Schema ───────────────────────────────────────────────────────

export interface IOtpDocument extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtpDocument>(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const OtpModel = mongoose.model<IOtpDocument>('Otp', OtpSchema);

// ─── FlashDeal Schema ──────────────────────────────────────────────────────────

export interface IFlashDealDocument extends Document {
  businessId: string;
  offer: string;
  image: string;
  type: string;
  navigateLink?: string;
  activeUntil?: Date;
  createdAt: Date;
}

const FlashDealSchema = new Schema<IFlashDealDocument>(
  {
    businessId: { type: Schema.Types.ObjectId as unknown as typeof String, ref: 'Business', required: true },
    offer: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, default: 'DISCOUNT' },
    navigateLink: String,
    activeUntil: Date,
  },
  { timestamps: true }
);

export const FlashDealModel = mongoose.model<IFlashDealDocument>('FlashDeal', FlashDealSchema);

// ─── Category Schema ───────────────────────────────────────────────────────────

export interface ICategoryDocument extends Document {
  name: string;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model<ICategoryDocument>('Category', CategorySchema);
