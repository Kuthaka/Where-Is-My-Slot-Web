import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../enums/status-code.enum';

// ─── Response Helper Middleware ────────────────────────────────────────────────

export function sendSuccess(res: Response, data: unknown, statusCode: number = StatusCode.OK): void {
  res.status(statusCode).json({
    success: true,
    statusCode,
    message: 'Success',
    data,
  });
}

export function sendCreated(res: Response, data: unknown): void {
  sendSuccess(res, data, StatusCode.CREATED);
}

// ─── Logging Middleware ────────────────────────────────────────────────────────

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
  });
  next();
}
