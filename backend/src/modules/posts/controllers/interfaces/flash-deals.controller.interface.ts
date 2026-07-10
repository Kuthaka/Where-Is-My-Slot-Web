import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export interface IFlashDealsController {
  getFlashDeals(req: Request, res: Response, next: NextFunction): Promise<void>;
  createFlashDeal(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
