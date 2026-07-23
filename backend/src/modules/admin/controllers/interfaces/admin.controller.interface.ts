import { Request, Response, NextFunction } from 'express';

export interface IAdminController {
  getAllBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  createAdminBusiness(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  approveBusiness(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  rejectBusiness(req: Request, res: Response, next: NextFunction): Promise<void> | void;
}
