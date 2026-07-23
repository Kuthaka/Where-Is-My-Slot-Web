import { Router } from 'express';
import { authenticate } from '../shared/middleware/auth.middleware';
import { IBusinessAuthController } from '../core/interfaces/controllers/business/auth.controller.interface';

export function createBusinessAuthRouter(authController: IBusinessAuthController): Router {
  const router = Router();

  // POST /api/v1/business-auth/send-otp  — send OTP to business email (registration)
  router.post('/send-otp', authController.sendOtp.bind(authController));

  // POST /api/v1/business-auth/verify-otp  — verify OTP, returns a short-lived session token
  router.post('/verify-otp', authController.verifyOtp.bind(authController));

  // POST /api/v1/business-auth/login  — merchant login with email + password
  router.post('/login', authController.login.bind(authController));

  // POST /api/v1/business-auth/set-password  — set/change merchant password
  router.post('/set-password', authenticate, authController.setPassword.bind(authController));

  return router;
}
