import { Request, Response, NextFunction } from 'express';

export interface ILocationController {
  search(req: Request, res: Response, next: NextFunction): Promise<void> | void;
  setLocation(req: Request, res: Response, next: NextFunction): Promise<void> | void;
}
