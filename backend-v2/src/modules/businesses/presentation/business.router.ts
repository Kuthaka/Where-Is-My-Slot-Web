import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { Types } from 'mongoose';
import { authenticate, requireRoles, AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../../shared/middleware/response.middleware';
import { UserRole } from '../../../shared/enums/user-role.enum';
import { OnboardBusinessUseCase } from '../application/use-cases/onboard-business.use-case';
import { UpdateBusinessUseCase } from '../application/use-cases/update-business.use-case';
import { AdminManageBusinessUseCase } from '../application/use-cases/admin-manage-business.use-case';
import { IBusinessRepository } from '../domain/repositories/business.repository.interface';
import { uploadBuffer } from '../../../infrastructure/services/cloudinary.service';
import { BusinessModel } from '../../../infrastructure/database/models/business.model';
import { BadRequestError } from '../../../shared/errors/app-error';

// ─── Business Router ───────────────────────────────────────────────────────────

const upload = multer({ storage: multer.memoryStorage() });

export function createBusinessRouter(
  businessRepository: IBusinessRepository,
  onboardBusinessUseCase: OnboardBusinessUseCase,
  updateBusinessUseCase: UpdateBusinessUseCase,
  adminManageBusinessUseCase: AdminManageBusinessUseCase
): Router {
  const router = Router();

  // GET /businesses/explore (public)
  router.get('/explore', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { search, category, cursor, limit } = req.query as Record<string, string>;
      const take = limit ? Math.min(parseInt(limit, 10), 20) : 12;
      const where: Record<string, unknown> = { status: 'APPROVED' };

      if (search) {
        where.$or = [
          { name: { $regex: search, $options: 'i' } },
          { tagline: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { area: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { primaryCategory: { $regex: search, $options: 'i' } },
        ];
      }

      if (category && category !== 'All') {
        where.primaryCategory = { $regex: category, $options: 'i' };
      }

      if (cursor) {
        where._id = { $lt: new Types.ObjectId(cursor) };
      }

      const businesses = await BusinessModel.find(where)
        .sort({ isVerified: -1, createdAt: -1 })
        .limit(take + 1)
        .select('name username tagline description primaryCategory subCategories logo coverPhoto area city isVerified phone googleMapsUrl')
        .exec();

      const hasMore = businesses.length > take;
      const items = hasMore ? businesses.slice(0, take) : businesses;
      const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

      const formatted = items.map((b) => ({
        ...b.toObject(),
        id: b._id.toString(),
        _count: { posts: 0, flashDeals: 0 },
        flashDeals: [],
      }));

      sendSuccess(res, { businesses: formatted, nextCursor, hasMore });
    } catch (err) {
      next(err);
    }
  });

  // GET /businesses/me (protected)
  router.get(
    '/me',
    authenticate,
    requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const businesses = await businessRepository.findByOwnerId(req.user!.id);
        if (businesses.length === 0) {
          sendSuccess(res, null);
          return;
        }
        sendSuccess(res, businesses[0].props);
      } catch (err) {
        next(err);
      }
    }
  );

  // PATCH /businesses/me (protected)
  router.patch(
    '/me',
    authenticate,
    requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const updated = await updateBusinessUseCase.execute(req.user!.id, req.body);
        sendSuccess(res, updated.props);
      } catch (err) {
        next(err);
      }
    }
  );

  // POST /businesses/onboard (protected)
  router.post(
    '/onboard',
    authenticate,
    requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        const business = await onboardBusinessUseCase.execute({
          ownerId: req.user!.id,
          ...req.body,
        });
        sendCreated(res, business.props);
      } catch (err) {
        next(err);
      }
    }
  );

  // POST /businesses/upload-image (protected)
  router.post(
    '/upload-image',
    authenticate,
    requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN),
    upload.single('file'),
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      try {
        if (!req.file) throw new BadRequestError('No image file provided');
        const url = await uploadBuffer(req.file.buffer);
        sendSuccess(res, { url });
      } catch (err) {
        next(err);
      }
    }
  );

  // GET /businesses (admin only)
  router.get(
    '/',
    authenticate,
    requireRoles(UserRole.SUPER_ADMIN),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const businesses = await adminManageBusinessUseCase.getAllBusinesses();
        sendSuccess(res, businesses.map((b) => b.props));
      } catch (err) {
        next(err);
      }
    }
  );

  // POST /businesses/admin/add (admin only)
  router.post(
    '/admin/add',
    authenticate,
    requireRoles(UserRole.SUPER_ADMIN),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const business = await adminManageBusinessUseCase.createAdminBusiness(req.body);
        sendCreated(res, business.props);
      } catch (err) {
        next(err);
      }
    }
  );

  // POST /businesses/:id/approve (admin only)
  router.post(
    '/:id/approve',
    authenticate,
    requireRoles(UserRole.SUPER_ADMIN),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const business = await adminManageBusinessUseCase.approveBusiness(req.params.id);
        sendSuccess(res, business.props);
      } catch (err) {
        next(err);
      }
    }
  );

  // POST /businesses/:id/reject (admin only)
  router.post(
    '/:id/reject',
    authenticate,
    requireRoles(UserRole.SUPER_ADMIN),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const business = await adminManageBusinessUseCase.rejectBusiness(req.params.id);
        sendSuccess(res, business.props);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
