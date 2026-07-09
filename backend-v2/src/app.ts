import express, { Application } from 'express';
import cors from 'cors';

// ─── Shared middleware ─────────────────────────────────────────────────────────
import { requestLogger } from './shared/middleware/response.middleware';
import { globalErrorHandler } from './shared/middleware/error-handler.middleware';

// ─── Infrastructure ────────────────────────────────────────────────────────────
import { MongooseUserRepository } from './infrastructure/repositories/mongoose-user.repository';
import { MongooseBusinessRepository } from './infrastructure/repositories/mongoose-business.repository';
import { MongoosePostRepository } from './infrastructure/repositories/mongoose-post.repository';
import { MongooseOtpRepository } from './infrastructure/repositories/mongoose-otp.repository';

// ─── Auth use cases ────────────────────────────────────────────────────────────
import { SendOtpUseCase } from './modules/auth/application/use-cases/send-otp.use-case';
import { VerifyOtpUseCase } from './modules/auth/application/use-cases/verify-otp.use-case';
import { LoginUseCase } from './modules/auth/application/use-cases/login.use-case';
import { RegisterUserUseCase } from './modules/auth/application/use-cases/register-user.use-case';
import { SetPasswordUseCase } from './modules/auth/application/use-cases/set-password.use-case';

// ─── Business use cases ────────────────────────────────────────────────────────
import { OnboardBusinessUseCase } from './modules/businesses/application/use-cases/onboard-business.use-case';
import { UpdateBusinessUseCase } from './modules/businesses/application/use-cases/update-business.use-case';
import { AdminManageBusinessUseCase } from './modules/businesses/application/use-cases/admin-manage-business.use-case';

// ─── Post use cases ────────────────────────────────────────────────────────────
import { CreatePostUseCase } from './modules/posts/application/use-cases/create-post.use-case';

// ─── Routers ───────────────────────────────────────────────────────────────────
import { createAuthRouter } from './modules/auth/presentation/auth.router';
import { createBusinessRouter } from './modules/businesses/presentation/business.router';
import { createPostsRouter } from './modules/posts/presentation/posts.router';
import { createFlashDealsRouter } from './modules/posts/presentation/flash-deals.router';

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

  // ── Auth Use Cases ───────────────────────────────────────────────────────────
  const sendOtpUseCase = new SendOtpUseCase(otpRepository);
  const verifyOtpUseCase = new VerifyOtpUseCase(otpRepository, userRepository);
  const loginUseCase = new LoginUseCase(userRepository);
  const registerUserUseCase = new RegisterUserUseCase(userRepository);
  const setPasswordUseCase = new SetPasswordUseCase(userRepository);

  // ── Business Use Cases ───────────────────────────────────────────────────────
  const onboardBusinessUseCase = new OnboardBusinessUseCase(businessRepository);
  const updateBusinessUseCase = new UpdateBusinessUseCase(businessRepository);
  const adminManageBusinessUseCase = new AdminManageBusinessUseCase(businessRepository);

  // ── Post Use Cases ───────────────────────────────────────────────────────────
  const createPostUseCase = new CreatePostUseCase(postRepository);

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
      const { UserModel } = await import('./infrastructure/database/models/user.model');
      const { BusinessModel } = await import('./infrastructure/database/models/business.model');
      const { CategoryModel } = await import('./infrastructure/database/models/misc.model');

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
  app.use(
    '/api/v1/auth',
    createAuthRouter(
      userRepository,
      sendOtpUseCase,
      verifyOtpUseCase,
      loginUseCase,
      registerUserUseCase,
      setPasswordUseCase
    )
  );

  app.use(
    '/api/v1/businesses',
    createBusinessRouter(
      businessRepository,
      onboardBusinessUseCase,
      updateBusinessUseCase,
      adminManageBusinessUseCase
    )
  );

  app.use('/api/v1/posts', createPostsRouter(postRepository, createPostUseCase));
  app.use('/api/v1/flash-deals', createFlashDealsRouter());

  // ── 404 Handler ───────────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({ success: false, statusCode: 404, message: 'Route not found' });
  });

  // ── Global Error Handler ──────────────────────────────────────────────────────
  app.use(globalErrorHandler);

  return app;
}
