import { Request, Response, NextFunction } from 'express';
import { IAuthController } from '../interfaces/auth.controller.interface';
import { IAuthService } from '../../services/interfaces/auth.service.interface';
import { sendSuccess, sendCreated } from '../../../../shared/middleware/response.middleware';
import { IUserRepository } from '../../../users/repositories/interfaces/user.repository.interface';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export class AuthController implements IAuthController {
  constructor(
    private readonly authService: IAuthService,
    private readonly userRepository: IUserRepository
  ) {}

  async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.sendOtp(req.body.email);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.verifyOtp(req.body.email, req.body.otp);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.login(req.body.email, req.body.password);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, username, email, password } = req.body;
      const name = `${firstName} ${lastName}`.trim();
      const user = await this.authService.registerUser({ name, username, email, passwordPlain: password });
      sendCreated(res, user);
    } catch (err) {
      next(err);
    }
  }

  async checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email } = req.query as { username?: string; email?: string };
      const result: { usernameAvailable?: boolean; emailAvailable?: boolean } = {};

      if (username) {
        const existing = await this.userRepository.findByUsername(username);
        result.usernameAvailable = !existing;
      }
      if (email) {
        const existing = await this.userRepository.findByEmail(email);
        result.emailAvailable = !existing;
      }

      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async setPassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.setPassword(
        req.user!.id,
        req.body.newPassword,
        req.body.oldPassword
      );
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.userRepository.findById(req.user!.id);
      if (!user) {
        sendSuccess(res, null);
        return;
      }
      const { passwordHash, ...safeUser } = user as any;
      sendSuccess(res, safeUser);
    } catch (err) {
      next(err);
    }
  }
}
