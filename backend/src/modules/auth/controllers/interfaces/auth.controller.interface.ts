import { Request, Response, NextFunction } from 'express';

export interface IAuthController {
  sendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
  setPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
}
