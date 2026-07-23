import { PostDto } from '../../../../dtos/business/post.dto';

export interface IPostsService {
  getPosts(cursor?: string, limit?: number, businessId?: string, userId?: string): Promise<{ posts: unknown[]; nextCursor: string | null }>;
  createPost(userId: string, data: { text: string; image?: string; tags?: string[]; location?: string }): Promise<PostDto>;
  deletePost(userId: string, postId: string): Promise<void>;
  updatePost(userId: string, postId: string, data: { text?: string; image?: string }): Promise<PostDto>;
  toggleLike(userId: string, postId: string): Promise<boolean>;
  addComment(userId: string, postId: string, text: string): Promise<unknown>;
  getComments(postId: string): Promise<unknown[]>;
  deleteComment(userId: string, commentId: string): Promise<boolean>;
  getFlashDeals(businessId?: string): Promise<unknown[]>;
  createFlashDeal(userId: string, data: { offer: string; image: string; type?: string; navigateLink?: string }): Promise<unknown>;
}
