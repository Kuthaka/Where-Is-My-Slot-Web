import { Router } from 'express';
import { IAdminController } from '../modules/admin/controllers/interfaces/admin.controller.interface';
import { authenticate, requireRoles } from '../shared/middleware/auth.middleware';
import { UserRole } from '../shared/enums/user-role.enum';

export function createAdminRouter(adminController: IAdminController): Router {
  const router = Router();

  router.use(authenticate, requireRoles(UserRole.SUPER_ADMIN));

  router.get('/businesses', adminController.getAllBusinesses.bind(adminController));
  router.post('/businesses/add', adminController.createAdminBusiness.bind(adminController));
  router.post('/businesses/:id/approve', adminController.approveBusiness.bind(adminController));
  router.post('/businesses/:id/reject', adminController.rejectBusiness.bind(adminController));

  return router;
}
