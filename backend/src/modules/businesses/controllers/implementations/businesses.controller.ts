import { Request, Response, NextFunction } from 'express';
import { IBusinessesController } from '../interfaces/businesses.controller.interface';
import { IBusinessesService } from '../../services/interfaces/businesses.service.interface';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../../../shared/middleware/response.middleware';
import { BadRequestError, NotFoundError } from '../../../../shared/errors/app-error';
import { catchAsync } from '../../../../shared/utils/catch-async';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../core/container/types';

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
    const isBusinessUser = req.user!.type === 'business';
    const updated = await this.businessesService.updateMyBusiness(req.user!.id, isBusinessUser, req.body);
    
    const { passwordHash, ...safeProps } = updated;
    sendSuccess(res, safeProps);
  });

  // ─── Public: Onboard (Register) ───────────────────────────────────────────────
  onboardBusiness = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { business, accessToken } = await this.businessesService.onboardBusiness(req.body);
    const { passwordHash: _, ...safeProps } = business;
    sendCreated(res, { business: safeProps, accessToken });
  });

  // ─── Public: Business Login ───────────────────────────────────────────────────
  businessLogin = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { business, accessToken } = await this.businessesService.businessLogin(req.body);
    const { passwordHash, ...safeProps } = business;
    sendSuccess(res, { business: safeProps, accessToken });
  });

  // ─── Authenticated Business: Set/Change Password ─────────────────────────────
  businessSetPassword = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.businessesService.businessSetPassword(req.user!.id, req.body);
    sendSuccess(res, { message: 'Password updated successfully' });
  });

  // ─── Public: Upload Image ─────────────────────────────────────────────────────
  uploadImage = catchAsync(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) throw new BadRequestError('No image file provided');
    const url = await this.businessesService.uploadImage(req.file.buffer);
    sendSuccess(res, { url });
  });

  // ─── Public: Send OTP (Business Registration) ────────────────────────────────
  businessSendOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this.businessesService.businessSendOtp(email);
    sendSuccess(res, { message: `OTP sent to ${email}` });
  });

  // ─── Public: Verify OTP (Business Registration) ──────────────────────────────
  businessVerifyOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    const result = await this.businessesService.businessVerifyOtp(email, otp);
    sendSuccess(res, result);
  });
}
