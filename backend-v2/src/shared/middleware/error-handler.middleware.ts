import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { StatusCode } from '../enums/status-code.enum';

// ─── Global Error Handler ──────────────────────────────────────────────────────

export function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  // Log unexpected errors
  console.error('[UnhandledError]', err);

  res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: StatusCode.INTERNAL_SERVER_ERROR,
    message: 'Internal server error',
  });
}
