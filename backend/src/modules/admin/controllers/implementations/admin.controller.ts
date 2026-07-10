import { Request, Response, NextFunction } from 'express';
import { IAdminController } from '../interfaces/admin.controller.interface';
import { IAdminService } from '../../services/interfaces/admin.service.interface';
import { sendSuccess, sendCreated } from '../../../../shared/middleware/response.middleware';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.AdminService) private readonly adminService: IAdminService
  ) {}

  async getAllBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const businesses = await this.adminService.getAllBusinesses();
      sendSuccess(res, businesses.map((b) => b.props));
    } catch (err) {
      next(err);
    }
  }

  async createAdminBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const business = await this.adminService.createAdminBusiness(req.body);
      sendCreated(res, business.props);
    } catch (err) {
      next(err);
    }
  }

  async approveBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const business = await this.adminService.approveBusiness(req.params.id);
      sendSuccess(res, business.props);
    } catch (err) {
      next(err);
    }
  }

  async rejectBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const business = await this.adminService.rejectBusiness(req.params.id);
      sendSuccess(res, business.props);
    } catch (err) {
      next(err);
    }
  }
}
