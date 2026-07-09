import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  text!: string;

  @Prop()
  image?: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop()
  location?: string;

  @Prop({ default: 0 })
  views!: number;

  @Prop({ type: Types.ObjectId, ref: 'Business', required: true, index: true })
  businessId!: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
