import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export interface IBusinessesController {
  exploreBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  getBusinessById(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  getMyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  updateMyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  onboardBusiness(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> | void;
}
