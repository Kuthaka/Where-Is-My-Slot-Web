import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export interface IPostsController {
  getPosts(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  createPost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  deletePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  updatePost(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  toggleLike(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  addComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  getComments(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  deleteComment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
}
