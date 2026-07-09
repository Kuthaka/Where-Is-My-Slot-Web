import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId!: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId!: string;

  @Prop({ required: true })
  text!: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
