import { PostDto } from '../../../../dtos/business/post.dto';

// ─── PostDto Repository Interface ─────────────────────────────────────────────────

export interface IPostRepository {
  create(post: PostDto): Promise<PostDto>;
  findById(id: string): Promise<PostDto | null>;
  findAll(
    cursor?: string,
    limit?: number,
    businessId?: string,
    userId?: string
  ): Promise<{ posts: unknown[]; nextCursor: string | null }>;
  update(id: string, text?: string, image?: string): Promise<PostDto>;
  delete(id: string): Promise<void>;
  toggleLike(postId: string, userId: string): Promise<boolean>;
  addComment(postId: string, userId: string, text: string): Promise<unknown>;
  deleteComment(commentId: string, userId: string): Promise<boolean>;
  getComments(postId: string): Promise<unknown[]>;
  getFlashDeals(businessId?: string): Promise<unknown[]>;
  createFlashDeal(businessId: string, offer: string, image: string, type: string, navigateLink?: string): Promise<unknown>;
}
