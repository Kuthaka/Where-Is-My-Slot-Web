import { Post } from '../entities/post.entity';

// ─── Post Repository Interface ─────────────────────────────────────────────────

export interface IPostRepository {
  create(post: Post): Promise<Post>;
  findById(id: string): Promise<Post | null>;
  findAll(
    cursor?: string,
    limit?: number,
    businessId?: string,
    userId?: string
  ): Promise<{ posts: unknown[]; nextCursor: string | null }>;
  update(id: string, text?: string, image?: string): Promise<Post>;
  delete(id: string): Promise<void>;
  toggleLike(postId: string, userId: string): Promise<boolean>;
  addComment(postId: string, userId: string, text: string): Promise<unknown>;
  deleteComment(commentId: string, userId: string): Promise<boolean>;
  getComments(postId: string): Promise<unknown[]>;
}
