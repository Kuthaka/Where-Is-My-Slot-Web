import { Router } from 'express';
import { authenticate } from '../shared/middleware/auth.middleware';
import { IBusinessesController } from '../modules/businesses/controllers/interfaces/businesses.controller.interface';

export function createBusinessAuthRouter(businessesController: IBusinessesController): Router {
  const router = Router();

  // POST /api/v1/business-auth/send-otp  — send OTP to business email (registration)
  router.post('/send-otp', businessesController.businessSendOtp.bind(businessesController));

  // POST /api/v1/business-auth/verify-otp  — verify OTP, returns a short-lived session token
  router.post('/verify-otp', businessesController.businessVerifyOtp.bind(businessesController));

  // POST /api/v1/business-auth/login  — merchant login with email + password
  router.post('/login', businessesController.businessLogin.bind(businessesController));

  // POST /api/v1/business-auth/set-password  — set/change merchant password
  router.post('/set-password', authenticate, businessesController.businessSetPassword.bind(businessesController));

  return router;
}
