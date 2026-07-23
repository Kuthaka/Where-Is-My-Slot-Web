import { IPostsService } from '../../core/interfaces/services/business/posts.service.interface';
import { IPostRepository } from '../../core/interfaces/repositories/business/post.repository.interface';
import { IBusinessRepository } from '../../core/interfaces/repositories/business/business.repository.interface';
import { PostDto } from '../../dtos/business/post.dto';
import { NotFoundError, ForbiddenError } from '../../shared/errors/app-error';
import { v4 as uuidv4 } from 'uuid';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/container/types';

@injectable()
export class PostsService implements IPostsService {
  constructor(
    @inject(TYPES.PostRepository) private readonly postRepository: IPostRepository,
    @inject(TYPES.BusinessRepository) private readonly businessRepository: IBusinessRepository
  ) {}

  async getPosts(cursor?: string, limit?: number, businessId?: string, userId?: string): Promise<{ posts: unknown[]; nextCursor: string | null }> {
    return this.postRepository.findAll(cursor, limit, businessId, userId);
  }

  async createPost(
    userId: string,
    data: { text: string; image?: string; tags?: string[]; location?: string }
  ): Promise<PostDto> {
    const businesses = await this.businessRepository.findByOwnerId(userId);
    if (businesses.length === 0) throw new NotFoundError('Business not found');
    const businessId = businesses[0].id;

    const post: Partial<PostDto> = {
      id: uuidv4(),
      text: data.text,
      image: data.image ?? null,
      tags: data.tags ?? [],
      location: data.location ?? null,
      views: 0,
      businessId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.postRepository.create(post as any);
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const businesses = await this.businessRepository.findByOwnerId(userId);
    if (businesses.length === 0) throw new ForbiddenError('Unauthorized to delete this post');
    const businessId = businesses[0].id;

    const post = await this.postRepository.findById(postId);
    if (!post || post.businessId !== businessId) {
      throw new ForbiddenError('Unauthorized to delete this post');
    }
    
    await this.postRepository.delete(postId);
  }

  async updatePost(userId: string, postId: string, data: { text?: string; image?: string }): Promise<PostDto> {
    const businesses = await this.businessRepository.findByOwnerId(userId);
    if (businesses.length === 0) throw new ForbiddenError('Unauthorized to update this post');
    const businessId = businesses[0].id;

    const post = await this.postRepository.findById(postId);
    if (!post || post.businessId !== businessId) {
      throw new ForbiddenError('Unauthorized to update this post');
    }

    return this.postRepository.update(postId, data.text, data.image);
  }

  async toggleLike(userId: string, postId: string): Promise<boolean> {
    return this.postRepository.toggleLike(postId, userId);
  }

  async addComment(userId: string, postId: string, text: string): Promise<unknown> {
    return this.postRepository.addComment(postId, userId, text);
  }

  async getComments(postId: string): Promise<unknown[]> {
    return this.postRepository.getComments(postId);
  }

  async deleteComment(userId: string, commentId: string): Promise<boolean> {
    const success = await this.postRepository.deleteComment(commentId, userId);
    if (!success) throw new ForbiddenError('Unauthorized to delete this comment');
    return success;
  }

  async getFlashDeals(businessId?: string): Promise<unknown[]> {
    return this.postRepository.getFlashDeals(businessId);
  }

  async createFlashDeal(userId: string, data: { offer: string; image: string; type?: string; navigateLink?: string }): Promise<unknown> {
    const businesses = await this.businessRepository.findByOwnerId(userId);
    if (businesses.length === 0) throw new NotFoundError('Business not found');
    const businessId = businesses[0].id;

    return this.postRepository.createFlashDeal(
      businessId,
      data.offer,
      data.image,
      data.type ?? 'DISCOUNT',
      data.navigateLink
    );
  }
}
