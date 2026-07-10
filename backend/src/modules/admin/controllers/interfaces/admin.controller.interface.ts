import { Request, Response, NextFunction } from 'express';

export interface IAdminController {
  getAllBusinesses(req: Request, res: Response, next: NextFunction): Promise<void>;
  createAdminBusiness(req: Request, res: Response, next: NextFunction): Promise<void>;
  approveBusiness(req: Request, res: Response, next: NextFunction): Promise<void>;
  rejectBusiness(req: Request, res: Response, next: NextFunction): Promise<void>;
}
