import express, { Application } from 'express';
import cors from 'cors';

// ─── Shared middleware ─────────────────────────────────────────────────────────
import { requestLogger } from './shared/middleware/response.middleware';
import { globalErrorHandler } from './shared/middleware/error-handler.middleware';

// ─── Infrastructure ────────────────────────────────────────────────────────────
import { MongooseUserRepository } from './modules/users/repositories/implementations/user.repository';
import { MongooseBusinessRepository } from './modules/businesses/repositories/implementations/business.repository';
import { MongoosePostRepository } from './modules/posts/repositories/implementations/post.repository';
import { MongooseOtpRepository } from './modules/auth/repositories/implementations/otp.repository';

// ─── Auth Module ───────────────────────────────────────────────────────────────
import { AuthService } from './modules/auth/services/implementations/auth.service';
import { AuthController } from './modules/auth/controllers/implementations/auth.controller';

// ─── Businesses Module ─────────────────────────────────────────────────────────
import { BusinessesService } from './modules/businesses/services/implementations/businesses.service';
import { BusinessesController } from './modules/businesses/controllers/implementations/businesses.controller';

// ─── Admin Module ──────────────────────────────────────────────────────────────
import { AdminService } from './modules/admin/services/implementations/admin.service';
import { AdminController } from './modules/admin/controllers/implementations/admin.controller';

// ─── Posts Module ──────────────────────────────────────────────────────────────
import { PostsService } from './modules/posts/services/implementations/posts.service';
import { PostsController } from './modules/posts/controllers/implementations/posts.controller';
import { FlashDealsController } from './modules/posts/controllers/implementations/flash-deals.controller';

// ─── Routers ───────────────────────────────────────────────────────────────────
import {
  createAuthRouter,
  createBusinessesRouter,
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

  // ── Repositories (Infrastructure Layer) ─────────────────────────────────────
  const userRepository = new MongooseUserRepository();
  const businessRepository = new MongooseBusinessRepository();
  const postRepository = new MongoosePostRepository();
  const otpRepository = new MongooseOtpRepository();

  // ── Auth Module ──────────────────────────────────────────────────────────────
  const authService = new AuthService(userRepository, otpRepository);
  const authController = new AuthController(authService, userRepository);

  // ── Businesses Module ────────────────────────────────────────────────────────
  const businessesService = new BusinessesService(businessRepository);
  const businessesController = new BusinessesController(businessesService, businessRepository);

  // ── Admin Module ─────────────────────────────────────────────────────────────
  const adminService = new AdminService(businessRepository);
  const adminController = new AdminController(adminService);

  // ── Posts Module ─────────────────────────────────────────────────────────────
  const postsService = new PostsService(postRepository);
  const postsController = new PostsController(postsService, postRepository);
  const flashDealsController = new FlashDealsController();

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
