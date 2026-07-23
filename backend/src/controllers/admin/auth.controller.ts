import { Request, Response } from 'express';
import { IAdminAuthController } from '../../core/interfaces/controllers/admin/auth.controller.interface';
import { IAdminAuthService } from '../../core/interfaces/services/admin/auth.service.interface';
import { sendSuccess } from '../../shared/middleware/response.middleware';
import { catchAsync } from '../../shared/utils/catch-async';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/container/types';

@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.AdminAuthService) private readonly adminAuthService: IAdminAuthService
  ) {}

  login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await this.adminAuthService.login(req.body);
    sendSuccess(res, result);
  });
}
