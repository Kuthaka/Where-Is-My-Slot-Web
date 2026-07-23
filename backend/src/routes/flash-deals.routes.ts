import { Router } from 'express';
import { IFlashDealsController } from '../core/interfaces/controllers/business/flash-deals.controller.interface';
import { authenticate } from '../shared/middleware/auth.middleware';

export function createFlashDealsRouter(flashDealsController: IFlashDealsController): Router {
  const router = Router();

  router.get('/', flashDealsController.getFlashDeals.bind(flashDealsController));
  router.post('/', authenticate, flashDealsController.createFlashDeal.bind(flashDealsController));

  return router;
}
