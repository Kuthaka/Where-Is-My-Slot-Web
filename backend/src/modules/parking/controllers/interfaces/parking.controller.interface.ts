import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export interface IParkingController {
  searchParking(req: Request, res: Response, next: NextFunction): Promise<void>;
  getParkingById(req: Request, res: Response, next: NextFunction): Promise<void>;
  
  createBusinessParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  getMyParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  updateBusinessParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  updateAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  deleteBusinessParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
  
  createCommunityParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
