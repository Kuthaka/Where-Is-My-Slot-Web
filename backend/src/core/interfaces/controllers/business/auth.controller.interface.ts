import { Request, Response, NextFunction } from 'express';

export interface IBusinessAuthController {
  login(req: Request, res: Response, next: NextFunction): void;
  setPassword(req: Request, res: Response, next: NextFunction): void;
  sendOtp(req: Request, res: Response, next: NextFunction): void;
  verifyOtp(req: Request, res: Response, next: NextFunction): void;
}
