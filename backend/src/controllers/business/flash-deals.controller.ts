import { Request, Response, NextFunction } from 'express';
import { IFlashDealsController } from '../../core/interfaces/controllers/business/flash-deals.controller.interface';
import { IPostsService } from '../../core/interfaces/services/business/posts.service.interface';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/middleware/response.middleware';
import { catchAsync } from '../../shared/utils/catch-async';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/container/types';

@injectable()
export class FlashDealsController implements IFlashDealsController {
  constructor(
    @inject(TYPES.PostsService) private readonly postsService: IPostsService
  ) {}

  getFlashDeals = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { businessId } = req.query as { businessId?: string };
    const deals = await this.postsService.getFlashDeals(businessId);
    sendSuccess(res, deals);
  });

  createFlashDeal = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const deal = await this.postsService.createFlashDeal(req.user!.id, req.body);
    sendCreated(res, deal);
  });
}
