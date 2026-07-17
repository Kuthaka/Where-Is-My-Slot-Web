import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export interface IBusinessesController {
  exploreBusinesses(req: Request, res: Response, next: NextFunction): Promise<void>;
  getBusinessById(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  updateMyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  onboardBusiness(req: Request, res: Response, next: NextFunction): Promise<void>;
  uploadImage(req: Request, res: Response, next: NextFunction): Promise<void>;
  businessLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
  businessSetPassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  businessSendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  businessVerifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
}
