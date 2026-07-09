import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Offer extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId!: string;

  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ default: true })
  isActive!: boolean;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
