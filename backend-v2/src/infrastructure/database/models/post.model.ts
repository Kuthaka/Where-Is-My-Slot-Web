import mongoose, { Schema, Document } from 'mongoose';

// ─── Post Mongoose Schema ──────────────────────────────────────────────────────

export interface IPostDocument extends Document {
  text: string;
  image?: string;
  tags: string[];
  location?: string;
  views: number;
  businessId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDocument>(
  {
    text: { type: String, required: true },
    image: String,
    tags: { type: [String], default: [] },
    location: String,
    views: { type: Number, default: 0 },
    businessId: { type: Schema.Types.ObjectId as unknown as typeof String, ref: 'Business', required: true, index: true },
  },
  { timestamps: true }
);

export const PostModel = mongoose.model<IPostDocument>('Post', PostSchema);

// ─── Like Schema ───────────────────────────────────────────────────────────────

export interface ILikeDocument extends Document {
  postId: string;
  userId: string;
}

const LikeSchema = new Schema<ILikeDocument>(
  {
    postId: { type: Schema.Types.ObjectId as unknown as typeof String, ref: 'Post', required: true },
    userId: { type: Schema.Types.ObjectId as unknown as typeof String, ref: 'User', required: true },
  },
  { timestamps: true }
);
LikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const LikeModel = mongoose.model<ILikeDocument>('Like', LikeSchema);

// ─── Comment Schema ────────────────────────────────────────────────────────────

export interface ICommentDocument extends Document {
  postId: string;
  userId: string;
  text: string;
  createdAt: Date;
}

const CommentSchema = new Schema<ICommentDocument>(
  {
    postId: { type: Schema.Types.ObjectId as unknown as typeof String, ref: 'Post', required: true },
    userId: { type: Schema.Types.ObjectId as unknown as typeof String, ref: 'User', required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export const CommentModel = mongoose.model<ICommentDocument>('Comment', CommentSchema);
