import { Router } from 'express';
import { IAuthController } from '../core/interfaces/controllers/user/auth.controller.interface';
import { authenticate } from '../shared/middleware/auth.middleware';
import { validateRequest } from '../shared/middleware/validate.middleware';
import {
  SendOtpDtoSchema,
  VerifyOtpDtoSchema,
  LoginDtoSchema,
  RegisterDtoSchema,
  SetPasswordDtoSchema
} from '../dtos/user/auth.dto';

export function createAuthRouter(authController: IAuthController): Router {
  const router = Router();

  router.post('/send-otp', validateRequest(SendOtpDtoSchema), authController.sendOtp.bind(authController));
  router.post('/verify-otp', validateRequest(VerifyOtpDtoSchema), authController.verifyOtp.bind(authController));
  router.post('/login', validateRequest(LoginDtoSchema), authController.login.bind(authController));
  router.post('/register', validateRequest(RegisterDtoSchema), authController.register.bind(authController));
  router.get('/check-availability', authController.checkAvailability.bind(authController));
  
  router.post('/set-password', authenticate, validateRequest(SetPasswordDtoSchema), authController.setPassword.bind(authController));
  router.get('/me', authenticate, authController.getMe.bind(authController));

  return router;
}
