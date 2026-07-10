import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export interface IPostsController {
  getPosts(req: Request, res: Response, next: NextFunction): Promise<void>;
  createPost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  deletePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  updatePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  toggleLike(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  addComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  getComments(req: Request, res: Response, next: NextFunction): Promise<void>;
  deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
