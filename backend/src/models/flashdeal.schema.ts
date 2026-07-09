import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class FlashDeal extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Business', required: true })
  businessId!: string;

  @Prop({ required: true })
  offer!: string;

  @Prop({ required: true })
  image!: string;

  @Prop({ default: 'DISCOUNT' })
  type!: string;

  @Prop()
  navigateLink?: string;

  @Prop()
  activeUntil?: Date;
}

export const FlashDealSchema = SchemaFactory.createForClass(FlashDeal);
