import { Router } from 'express';
import { IAdminAuthController } from '../core/interfaces/controllers/admin/auth.controller.interface';

export function createAdminAuthRouter(authController: IAdminAuthController): Router {
  const router = Router();

  // POST /api/v1/admin-auth/login  — Admin login with email + password
  router.post('/login', authController.login.bind(authController));

  return router;
}
