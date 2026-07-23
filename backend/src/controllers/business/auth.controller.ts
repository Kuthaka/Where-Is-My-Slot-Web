import { Request, Response } from 'express';
import { IBusinessAuthController } from '../../core/interfaces/controllers/business/auth.controller.interface';
import { IBusinessAuthService } from '../../core/interfaces/services/business/auth.service.interface';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess } from '../../shared/middleware/response.middleware';
import { catchAsync } from '../../shared/utils/catch-async';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/container/types';

@injectable()
export class BusinessAuthController implements IBusinessAuthController {
  constructor(
    @inject(TYPES.BusinessAuthService) private readonly businessAuthService: IBusinessAuthService
  ) {}

  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.businessAuthService.login(req.body);
    const { passwordHash, ...safeProps } = result.business as any;
    sendSuccess(res, { business: safeProps, accessToken: result.accessToken });
  });

  setPassword = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await this.businessAuthService.setPassword(req.user!.id, req.body);
    sendSuccess(res, { message: 'Password updated successfully' });
  });

  sendOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this.businessAuthService.sendOtp(email);
    sendSuccess(res, { message: `OTP sent to ${email}` });
  });

  verifyOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;
    const result = await this.businessAuthService.verifyOtp(email, otp);
    sendSuccess(res, result);
  });
}
