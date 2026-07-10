import { Request, Response, NextFunction } from 'express';
import { IPostsController } from '../interfaces/posts.controller.interface';
import { IPostsService } from '../../services/interfaces/posts.service.interface';
import { IPostRepository } from '../../repositories/interfaces/post.repository.interface';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../../../shared/middleware/response.middleware';
import { BusinessModel } from '../../../../models/business.model';
import { NotFoundError, ForbiddenError } from '../../../../shared/errors/app-error';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class PostsController implements IPostsController {
  constructor(
    @inject(TYPES.PostsService) private readonly postsService: IPostsService,
    @inject(TYPES.PostRepository) private readonly postRepository: IPostRepository
  ) {}

  async getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { cursor, limit, businessId, userId } = req.query as Record<string, string>;
      const parsedLimit = limit ? parseInt(limit, 10) : 5;
      const result = await this.postRepository.findAll(cursor, parsedLimit, businessId, userId);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async createPost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const business = await BusinessModel.findOne({ ownerId: req.user!.id }).exec();
      if (!business) throw new NotFoundError('Business not found');

      const post = await this.postsService.createPost(business._id.toString(), req.body);
      sendCreated(res, post.props);
    } catch (err) {
      next(err);
    }
  }

  async deletePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const business = await BusinessModel.findOne({ ownerId: req.user!.id }).exec();
      const post = await this.postRepository.findById(req.params.id);
      if (!business || post?.props.businessId !== business._id.toString()) {
        throw new ForbiddenError('Unauthorized to delete this post');
      }
      await this.postRepository.delete(req.params.id);
      sendSuccess(res, { success: true });
    } catch (err) {
      next(err);
    }
  }

  async updatePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const business = await BusinessModel.findOne({ ownerId: req.user!.id }).exec();
      const post = await this.postRepository.findById(req.params.id);
      if (!business || post?.props.businessId !== business._id.toString()) {
        throw new ForbiddenError('Unauthorized to update this post');
      }
      const updated = await this.postRepository.update(req.params.id, req.body.text, req.body.image);
      sendSuccess(res, updated.props);
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const isLiked = await this.postRepository.toggleLike(req.params.id, req.user!.id);
      sendSuccess(res, { isLiked });
    } catch (err) {
      next(err);
    }
  }

  async addComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const comment = await this.postRepository.addComment(req.params.id, req.user!.id, req.body.text);
      sendCreated(res, comment);
    } catch (err) {
      next(err);
    }
  }

  async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comments = await this.postRepository.getComments(req.params.id);
      sendSuccess(res, comments);
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const success = await this.postRepository.deleteComment(req.params.id, req.user!.id);
      if (!success) throw new ForbiddenError('Unauthorized to delete this comment');
      sendSuccess(res, { success });
    } catch (err) {
      next(err);
    }
  }
}
