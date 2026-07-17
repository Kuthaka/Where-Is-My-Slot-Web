import { Router } from 'express';
import multer from 'multer';
import { IBusinessesController } from '../modules/businesses/controllers/interfaces/businesses.controller.interface';
import { authenticate, requireRoles } from '../shared/middleware/auth.middleware';
import { UserRole } from '../shared/enums/user-role.enum';

const upload = multer({ storage: multer.memoryStorage() });

export function createBusinessesRouter(businessesController: IBusinessesController): Router {
  const router = Router();

  router.get('/explore', businessesController.exploreBusinesses.bind(businessesController));
  
  router.get(
    '/me',
    authenticate,
    requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN),
    businessesController.getMyBusiness.bind(businessesController)
  );

  router.get('/:id', businessesController.getBusinessById.bind(businessesController));

  router.patch(
    '/me',
    authenticate,
    requireRoles(UserRole.BUSINESS, UserRole.SUPER_ADMIN),
    businessesController.updateMyBusiness.bind(businessesController)
  );

  router.post(
    '/onboard',
    businessesController.onboardBusiness.bind(businessesController)
  );

  router.post(
    '/upload-image',
    upload.single('file'),
    businessesController.uploadImage.bind(businessesController)
  );

  return router;
}
