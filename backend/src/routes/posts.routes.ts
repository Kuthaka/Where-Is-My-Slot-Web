import { Router } from 'express';
import { IPostsController } from '../modules/posts/controllers/interfaces/posts.controller.interface';
import { authenticate } from '../shared/middleware/auth.middleware';

export function createPostsRouter(postsController: IPostsController): Router {
  const router = Router();

  router.get('/', postsController.getPosts.bind(postsController));
  router.post('/', authenticate, postsController.createPost.bind(postsController));
  router.delete('/:id', authenticate, postsController.deletePost.bind(postsController));
  router.post('/:id', authenticate, postsController.updatePost.bind(postsController));
  router.post('/:id/like', authenticate, postsController.toggleLike.bind(postsController));
  router.post('/:id/comments', authenticate, postsController.addComment.bind(postsController));
  router.get('/:id/comments', postsController.getComments.bind(postsController));
  router.delete('/comments/:id', authenticate, postsController.deleteComment.bind(postsController));

  return router;
}
