import { Router } from 'express';
import { IParkingController } from '../core/interfaces/controllers/business/parking.controller.interface';
import { authenticate, requireRoles } from '../shared/middleware/auth.middleware';
import { UserRole } from '../shared/enums/user-role.enum';

export function createParkingRouter(parkingController: IParkingController): Router {
  const router = Router();

  // Public Endpoints
  router.get('/search', parkingController.searchParking.bind(parkingController));
  router.get('/:id', parkingController.getParkingById.bind(parkingController));

  // Community Flow
  router.post('/community', authenticate, requireRoles(UserRole.USER), parkingController.createCommunityParking.bind(parkingController));

  // Business Flow
  router.get('/business/me', authenticate, requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN), parkingController.getMyParking.bind(parkingController));
  router.post('/business', authenticate, requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN), parkingController.createBusinessParking.bind(parkingController));
  router.patch('/business/:id', authenticate, requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN), parkingController.updateBusinessParking.bind(parkingController));
  router.patch('/business/:id/availability', authenticate, requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN), parkingController.updateAvailability.bind(parkingController));
  router.delete('/business/:id', authenticate, requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN), parkingController.deleteBusinessParking.bind(parkingController));

  return router;
}
