import express, { Application } from 'express';
import cors from 'cors';

// ─── Shared middleware ─────────────────────────────────────────────────────────
import { requestLogger } from './shared/middleware/response.middleware';
import { globalErrorHandler } from './shared/middleware/error-handler.middleware';

import { IAuthController } from './modules/auth/controllers/interfaces/auth.controller.interface';
import { IBusinessesController } from './modules/businesses/controllers/interfaces/businesses.controller.interface';
import { IAdminController } from './modules/admin/controllers/interfaces/admin.controller.interface';
import { IPostsController } from './modules/posts/controllers/interfaces/posts.controller.interface';
import { IFlashDealsController } from './modules/posts/controllers/interfaces/flash-deals.controller.interface';

// ─── Container ─────────────────────────────────────────────────────────────────
import { container } from './core/container/inversify';
import { TYPES } from './core/container/types';

// ─── Routers ───────────────────────────────────────────────────────────────────
import {
  createAuthRouter,
  createBusinessesRouter,
  createBusinessAuthRouter,
  createAdminRouter,
  createPostsRouter,
  createFlashDealsRouter,
} from './routes';


// ─── App Factory ───────────────────────────────────────────────────────────────

export function createApp(): Application {
  const app = express();

  // ── Global Middleware ────────────────────────────────────────────────────────
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use(requestLogger);

  // ── Retrieve Controllers from Container ──────────────────────────────────────
  const authController = container.get<IAuthController>(TYPES.AuthController);
  const businessesController = container.get<IBusinessesController>(TYPES.BusinessesController);
  const adminController = container.get<IAdminController>(TYPES.AdminController);
  const postsController = container.get<IPostsController>(TYPES.PostsController);
  const flashDealsController = container.get<IFlashDealsController>(TYPES.FlashDealsController);

  // ── Health Check ─────────────────────────────────────────────────────────────
  app.get('/api/v1/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
    });
  });

  // ── Seed Route ────────────────────────────────────────────────────────────────
  app.post('/api/v1/seed', async (_req, res, next) => {
    try {
      const bcrypt = await import('bcrypt');
      const { UserModel } = await import('./models/user.model');
      const { BusinessModel } = await import('./models/business.model');
      const { CategoryModel } = await import('./models/misc.model');

      const hashedPassword = await bcrypt.default.hash('password123', 10);

      let user = await UserModel.findOne({ email: 'testowner@example.com' });
      if (!user) {
        user = await UserModel.create({
          name: 'Test Owner',
          email: 'testowner@example.com',
          password: hashedPassword,
          role: 'BUSINESS',
        });
      }

      let category = await CategoryModel.findOne({ name: 'Food & Beverage' });
      if (!category) {
        category = await CategoryModel.create({ name: 'Food & Beverage' });
      }

      const business = await BusinessModel.create({
        ownerId: user._id.toString(),
        name: 'Social Offline',
        description: 'A great place to hang out.',
        address: 'Indiranagar, Bangalore',
        latitude: 12.9783,
        longitude: 77.6408,
        isVerified: true,
        status: 'APPROVED',
      });

      res.json({ success: true, data: { user, category, business } });
    } catch (err) {
      next(err);
    }
  });

  // ── Module Routes ─────────────────────────────────────────────────────────────
  app.use('/api/v1/auth', createAuthRouter(authController));
  app.use('/api/v1/business-auth', createBusinessAuthRouter(businessesController));
  app.use('/api/v1/businesses', createBusinessesRouter(businessesController));
  app.use('/api/v1/admin', createAdminRouter(adminController));
  app.use('/api/v1/posts', createPostsRouter(postsController));
  app.use('/api/v1/flash-deals', createFlashDealsRouter(flashDealsController));

  // ── 404 Handler ───────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, statusCode: 404, message: 'Route not found' });
  });

  // ── Global Error Handler ──────────────────────────────────────────────────────
  app.use(globalErrorHandler);

  return app;
}
