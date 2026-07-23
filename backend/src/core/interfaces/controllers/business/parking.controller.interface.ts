import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';

export interface IParkingController {
  searchParking(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  getParkingById(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  
  createBusinessParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  getMyParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  updateBusinessParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  updateAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  deleteBusinessParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
  
  createCommunityParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> | void;
}
