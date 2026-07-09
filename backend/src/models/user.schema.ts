import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ unique: true, sparse: true })
  username?: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop()
  password?: string;

  @Prop({ default: false })
  isPasswordSet!: boolean;

  @Prop({ default: 'USER' })
  role!: string;

  @Prop({ default: true })
  isActive!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
