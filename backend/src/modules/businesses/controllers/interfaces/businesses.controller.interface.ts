import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export interface IBusinessesController {
  exploreBusinesses(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  updateMyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  onboardBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  uploadImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
