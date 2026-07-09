import { Router, Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { authenticate, AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../../shared/middleware/response.middleware';
import { BusinessModel } from '../../../infrastructure/database/models/business.model';
import { FlashDealModel } from '../../../infrastructure/database/models/misc.model';
import { NotFoundError } from '../../../shared/errors/app-error';

// ─── Flash Deals Router ────────────────────────────────────────────────────────

export function createFlashDealsRouter(): Router {
  const router = Router();

  // GET /flash-deals
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { businessId } = req.query as { businessId?: string };
      const where: Record<string, unknown> = { activeUntil: { $gt: new Date() } };
      if (businessId) where.businessId = new Types.ObjectId(businessId);

      const deals = await FlashDealModel.find(where).sort({ createdAt: -1 }).exec();

      const result = await Promise.all(
        deals.map(async (deal) => {
          const business = await BusinessModel.findById(deal.businessId).exec();
          return {
            ...deal.toObject(),
            business: business
              ? {
                  id: business._id,
                  name: business.name,
                  logo: business.logo,
                  isVerified: business.isVerified,
                  username: business.username,
                }
              : null,
          };
        })
      );

      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  });

  // POST /flash-deals (protected)
  router.post('/', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const business = await BusinessModel.findOne({ ownerId: req.user!.id }).exec();
      if (!business) throw new NotFoundError('Business not found');

      const deal = await FlashDealModel.create({
        businessId: business._id.toString(),
        offer: req.body.offer,
        image: req.body.image,
        type: req.body.type ?? 'DISCOUNT',
        navigateLink: req.body.navigateLink ?? undefined,
        activeUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      });

      sendCreated(res, deal);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
