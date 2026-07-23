import { Request, Response, NextFunction } from 'express';
import { IBusinessesController } from '../../core/interfaces/controllers/business/businesses.controller.interface';
import { IBusinessesService } from '../../core/interfaces/services/business/businesses.service.interface';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../shared/middleware/response.middleware';
import { BadRequestError, NotFoundError } from '../../shared/errors/app-error';
import { catchAsync } from '../../shared/utils/catch-async';
import { BusinessOnboardingSchema } from '../../validations/business/onboarding.schema';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/container/types';

@injectable()
export class BusinessesController implements IBusinessesController {
  constructor(
    @inject(TYPES.BusinessesService) private readonly businessesService: IBusinessesService
  ) {}

  // ─── Public: Explore ──────────────────────────────────────────────────────────
  exploreBusinesses = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const filters = req.query as Record<string, string>;
    const limit = filters.limit ? parseInt(filters.limit, 10) : undefined;
    
    const result = await this.businessesService.exploreBusinesses({
      ...filters,
      limit,
    });
    
    const formatted = result.businesses.map((b) => ({
      ...b,
      _count: { posts: 0, flashDeals: 0 },
      flashDeals: [],
    }));

    sendSuccess(res, { businesses: formatted, nextCursor: result.nextCursor, hasMore: result.hasMore });
  });

  // ─── Public: Get Business by ID ──────────────────────────────────────────────
  getBusinessById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const business = await this.businessesService.getBusinessById(id);
    if (!business) throw new NotFoundError('Business not found');
    
    const { passwordHash, ...safeProps } = business;
    sendSuccess(res, safeProps);
  });

  // ─── Authenticated Business: Get My Business ──────────────────────────────────
  getMyBusiness = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const isBusinessUser = req.user!.type === 'business';
    const business = await this.businessesService.getMyBusiness(req.user!.id, isBusinessUser);

    if (!business) {
      sendSuccess(res, null);
      return;
    }
    
    const { passwordHash, ...safeProps } = business;
    sendSuccess(res, safeProps);
  });

  // ─── Authenticated Business: Update ──────────────────────────────────────────
  updateMyBusiness = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Note: Can use a partial schema here if needed, but for now we validate on onboard
    const isBusinessUser = req.user!.type === 'business';
    const updated = await this.businessesService.updateMyBusiness(req.user!.id, isBusinessUser, req.body);
    
    const { passwordHash, ...safeProps } = updated;
    sendSuccess(res, safeProps);
  });

  // ─── Public: Onboard (Register) ───────────────────────────────────────────────
  onboardBusiness = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const parseResult = BusinessOnboardingSchema.safeParse(req.body);
    if (!parseResult.success) {
      throw new BadRequestError('Validation failed: ' + parseResult.error.errors.map(e => e.message).join(', '));
    }

    const { business, accessToken } = await this.businessesService.onboardBusiness(req.body);
    const { passwordHash: _, ...safeProps } = business;
    sendCreated(res, { business: safeProps, accessToken });
  });
  // ─── Public: Upload Image ─────────────────────────────────────────────────────
  uploadImage = catchAsync(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) throw new BadRequestError('No image file provided');
    const url = await this.businessesService.uploadImage(req.file.buffer);
    sendSuccess(res, { url });
  });
}
