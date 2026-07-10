import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { BadRequestError } from '../errors/app-error';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ');
        next(new BadRequestError(`Validation failed: ${errors}`));
      } else {
        next(error);
      }
    }
  };
};
