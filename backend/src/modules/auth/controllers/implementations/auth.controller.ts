import { Request, Response, NextFunction } from 'express';
import { IAuthController } from '../interfaces/auth.controller.interface';
import { IAuthService } from '../../services/interfaces/auth.service.interface';
import { sendSuccess, sendCreated } from '../../../../shared/middleware/response.middleware';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { catchAsync } from '../../../../shared/utils/catch-async';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly authService: IAuthService
  ) {}

  sendOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.sendOtp(req.body.email);
    sendSuccess(res, result);
  });

  verifyOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.verifyOtp(req.body.email, req.body.otp);
    sendSuccess(res, result);
  });

  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body.email, req.body.password);
    sendSuccess(res, result);
  });

  register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, username, email, password, otp } = req.body;
    const name = `${firstName} ${lastName}`.trim();
    const result = await this.authService.registerUser({ name, username, email, passwordPlain: password, otp });
    sendCreated(res, result);
  });

  checkAvailability = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { username, email } = req.query as { username?: string; email?: string };
    const result = await this.authService.checkAvailability(username, email);
    sendSuccess(res, result);
  });

  setPassword = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const result = await this.authService.setPassword(
      req.user!.id,
      req.body.newPassword,
      req.body.oldPassword
    );
    sendSuccess(res, result);
  });

  getMe = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const user = await this.authService.getMe(req.user!.id);
    sendSuccess(res, user);
  });
}
