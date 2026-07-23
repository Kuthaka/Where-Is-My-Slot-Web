import { Request, Response, NextFunction } from 'express';

export interface IAuthController {
  sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  login(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  register(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  setPassword(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  getMe(req: Request, res: Response, next: NextFunction): Promise<void> | void;
}
