import { Request, Response, NextFunction } from 'express';
import { IAdminController } from '../../core/interfaces/controllers/admin/admin.controller.interface';
import { IAdminService } from '../../core/interfaces/services/admin/admin.service.interface';
import { sendSuccess, sendCreated } from '../../shared/middleware/response.middleware';
import { catchAsync } from '../../shared/utils/catch-async';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/container/types';

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.AdminService) private readonly adminService: IAdminService
  ) {}

  getAllBusinesses = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const businesses = await this.adminService.getAllBusinesses();
    sendSuccess(res, businesses.map((b) => b));
  });

  createAdminBusiness = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const business = await this.adminService.createAdminBusiness(req.body);
    sendCreated(res, business);
  });

  approveBusiness = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const business = await this.adminService.approveBusiness(req.params.id);
    sendSuccess(res, business);
  });

  rejectBusiness = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const business = await this.adminService.rejectBusiness(req.params.id);
    sendSuccess(res, business);
  });
}
