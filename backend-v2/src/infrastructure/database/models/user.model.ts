import mongoose, { Schema, Document } from 'mongoose';

// ─── User Mongoose Schema ──────────────────────────────────────────────────────

export interface IUserDocument extends Document {
  name: string;
  username?: string;
  email: string;
  password?: string;
  isPasswordSet: boolean;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isPasswordSet: { type: Boolean, default: false },
    role: { type: String, default: 'USER' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
