import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, AuthenticatedRequest } from '../../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../../shared/middleware/response.middleware';
import { SendOtpUseCase } from '../application/use-cases/send-otp.use-case';
import { VerifyOtpUseCase } from '../application/use-cases/verify-otp.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterUserUseCase } from '../application/use-cases/register-user.use-case';
import { SetPasswordUseCase } from '../application/use-cases/set-password.use-case';
import { IUserRepository } from '../../users/domain/repositories/user.repository.interface';

// ─── Auth Router ───────────────────────────────────────────────────────────────

export function createAuthRouter(
  userRepository: IUserRepository,
  sendOtpUseCase: SendOtpUseCase,
  verifyOtpUseCase: VerifyOtpUseCase,
  loginUseCase: LoginUseCase,
  registerUserUseCase: RegisterUserUseCase,
  setPasswordUseCase: SetPasswordUseCase
): Router {
  const router = Router();

  // POST /auth/send-otp
  router.post('/send-otp', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await sendOtpUseCase.execute(req.body.email);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  });

  // POST /auth/verify-otp
  router.post('/verify-otp', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await verifyOtpUseCase.execute(req.body.email, req.body.otp);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  });

  // POST /auth/login
  router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await loginUseCase.execute(req.body.email, req.body.password);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  });

  // POST /auth/register
  router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, username, email, password } = req.body;
      const name = `${firstName} ${lastName}`.trim();
      const user = await registerUserUseCase.execute({ name, username, email, passwordPlain: password });
      sendCreated(res, user);
    } catch (err) {
      next(err);
    }
  });

  // GET /auth/check-availability
  router.get('/check-availability', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email } = req.query as { username?: string; email?: string };
      const result: { usernameAvailable?: boolean; emailAvailable?: boolean } = {};

      if (username) {
        const existing = await userRepository.findByUsername(username);
        result.usernameAvailable = !existing;
      }
      if (email) {
        const existing = await userRepository.findByEmail(email);
        result.emailAvailable = !existing;
      }

      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  });

  // POST /auth/set-password (protected)
  router.post('/set-password', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await setPasswordUseCase.execute(
        req.user!.id,
        req.body.newPassword,
        req.body.oldPassword
      );
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  });

  // GET /auth/me (protected)
  router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = await userRepository.findById(req.user!.id);
      if (!user) {
        sendSuccess(res, null);
        return;
      }
      const { passwordHash, ...safeUser } = user as any;
      sendSuccess(res, safeUser);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
