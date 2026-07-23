import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

/**
 * Wraps an asynchronous express middleware to catch any unhandled promise rejections
 * and automatically forward them to the express error handling middleware.
 */
export const catchAsync = (fn: AsyncFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
