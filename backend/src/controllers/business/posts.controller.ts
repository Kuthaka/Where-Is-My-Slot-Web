import { Request, Response, NextFunction } from 'express';
import { IPostsController } from '../../core/interfaces/controllers/business/posts.controller.interface';
import { IPostsService } from '../../core/interfaces/services/business/posts.service.interface';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/middleware/response.middleware';
import { catchAsync } from '../../shared/utils/catch-async';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/container/types';

@injectable()
export class PostsController implements IPostsController {
  constructor(
    @inject(TYPES.PostsService) private readonly postsService: IPostsService
  ) {}

  getPosts = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { cursor, limit, businessId, userId } = req.query as Record<string, string>;
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    const result = await this.postsService.getPosts(cursor, parsedLimit, businessId, userId);
    sendSuccess(res, result);
  });

  createPost = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const post = await this.postsService.createPost(req.user!.id, req.body);
    sendCreated(res, post);
  });

  deletePost = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.postsService.deletePost(req.user!.id, req.params.id);
    sendSuccess(res, { success: true });
  });

  updatePost = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const updated = await this.postsService.updatePost(req.user!.id, req.params.id, req.body);
    sendSuccess(res, updated);
  });

  toggleLike = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const isLiked = await this.postsService.toggleLike(req.user!.id, req.params.id);
    sendSuccess(res, { isLiked });
  });

  addComment = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const comment = await this.postsService.addComment(req.user!.id, req.params.id, req.body.text);
    sendCreated(res, comment);
  });

  getComments = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const comments = await this.postsService.getComments(req.params.id);
    sendSuccess(res, comments);
  });

  deleteComment = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.postsService.deleteComment(req.user!.id, req.params.id);
    sendSuccess(res, { success: true });
  });
}
