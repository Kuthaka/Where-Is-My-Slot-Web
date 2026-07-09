import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../../shared/middleware/response.middleware';
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case';
import { IPostRepository } from '../domain/repositories/post.repository.interface';
import { BusinessModel } from '../../../infrastructure/database/models/business.model';
import { NotFoundError, ForbiddenError } from '../../../shared/errors/app-error';

// ─── Posts Router ──────────────────────────────────────────────────────────────

export function createPostsRouter(
  postRepository: IPostRepository,
  createPostUseCase: CreatePostUseCase
): Router {
  const router = Router();

  // GET /posts
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { cursor, limit, businessId, userId } = req.query as Record<string, string>;
      const parsedLimit = limit ? parseInt(limit, 10) : 5;
      const result = await postRepository.findAll(cursor, parsedLimit, businessId, userId);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  });

  // POST /posts (protected)
  router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const business = await BusinessModel.findOne({ ownerId: req.user!.id }).exec();
      if (!business) throw new NotFoundError('Business not found');

      const post = await createPostUseCase.execute(business._id.toString(), req.body);
      sendCreated(res, post.props);
    } catch (err) {
      next(err);
    }
  });

  // DELETE /posts/:id (protected)
  router.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const business = await BusinessModel.findOne({ ownerId: req.user!.id }).exec();
      const post = await postRepository.findById(req.params.id);
      if (!business || post?.props.businessId !== business._id.toString()) {
        throw new ForbiddenError('Unauthorized to delete this post');
      }
      await postRepository.delete(req.params.id);
      sendSuccess(res, { success: true });
    } catch (err) {
      next(err);
    }
  });

  // POST /posts/:id (update - protected)
  router.post('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const business = await BusinessModel.findOne({ ownerId: req.user!.id }).exec();
      const post = await postRepository.findById(req.params.id);
      if (!business || post?.props.businessId !== business._id.toString()) {
        throw new ForbiddenError('Unauthorized to update this post');
      }
      const updated = await postRepository.update(req.params.id, req.body.text, req.body.image);
      sendSuccess(res, updated.props);
    } catch (err) {
      next(err);
    }
  });

  // POST /posts/:id/like (protected)
  router.post('/:id/like', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const isLiked = await postRepository.toggleLike(req.params.id, req.user!.id);
      sendSuccess(res, { isLiked });
    } catch (err) {
      next(err);
    }
  });

  // POST /posts/:id/comments (protected)
  router.post('/:id/comments', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const comment = await postRepository.addComment(req.params.id, req.user!.id, req.body.text);
      sendCreated(res, comment);
    } catch (err) {
      next(err);
    }
  });

  // GET /posts/:id/comments
  router.get('/:id/comments', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await postRepository.getComments(req.params.id);
      sendSuccess(res, comments);
    } catch (err) {
      next(err);
    }
  });

  // DELETE /posts/comments/:id (protected)
  router.delete('/comments/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const success = await postRepository.deleteComment(req.params.id, req.user!.id);
      if (!success) throw new ForbiddenError('Unauthorized to delete this comment');
      sendSuccess(res, { success });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
