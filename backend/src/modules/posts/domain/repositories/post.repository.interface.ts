import { Post } from '../entities/post.entity';
export const POST_REPOSITORY = Symbol('POST_REPOSITORY');
export interface IPostRepository {
  create(post: Post): Promise<Post>;
  findAll(cursor?: string, limit?: number, businessId?: string, userId?: string): Promise<{posts: any[], nextCursor: string | null}>;
  findById(id: string): Promise<any | null>;
  update(id: string, text: string, image?: string): Promise<any>;
  delete(id: string): Promise<void>;
  toggleLike(postId: string, userId: string): Promise<boolean>;
  addComment(postId: string, userId: string, text: string): Promise<any>;
  deleteComment(commentId: string, userId: string): Promise<boolean>;
}