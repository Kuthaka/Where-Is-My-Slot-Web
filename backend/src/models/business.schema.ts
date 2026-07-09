import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Business extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  ownerId?: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ unique: true, sparse: true })
  username?: string;

  @Prop()
  tagline?: string;

  @Prop()
  description?: string;

  @Prop()
  establishedYear?: number;

  @Prop()
  gstNumber?: string;

  @Prop()
  contactPerson?: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop()
  websiteUrl?: string;

  @Prop()
  whatsappNumber?: string;

  @Prop({ type: [String], default: [] })
  mobileNumbers!: string[];

  @Prop({ type: [String], default: [] })
  landlineNumbers!: string[];

  @Prop({ type: [String], default: [] })
  emails!: string[];

  @Prop()
  address?: string;

  @Prop()
  pincode?: string;

  @Prop()
  plotNo?: string;

  @Prop()
  buildingName?: string;

  @Prop()
  streetName?: string;

  @Prop()
  landmark?: string;

  @Prop()
  area?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;

  @Prop()
  googleMapsUrl?: string;

  @Prop({ type: Object })
  timings?: any;

  @Prop()
  primaryCategory?: string;

  @Prop({ type: [String], default: [] })
  subCategories!: string[];

  @Prop({ type: [String], default: [] })
  amenities!: string[];

  @Prop({ type: Object })
  parking?: any;

  @Prop()
  logo?: string;

  @Prop()
  coverPhoto?: string;

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop({ type: Object })
  socialLinks?: any;

  @Prop({ default: false })
  isVerified!: boolean;

  @Prop({ default: 'PENDING' })
  status!: string;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
