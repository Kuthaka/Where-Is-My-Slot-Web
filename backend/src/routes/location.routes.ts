import { Router } from 'express';
import { ILocationController } from '../modules/location/controllers/interfaces/location.controller.interface';
import { authenticate } from '../shared/middleware/auth.middleware';
import { validateRequest } from '../shared/middleware/validate.middleware';
import { SetLocationDtoSchema } from '../modules/location/dtos/location.dto';

export function createLocationRouter(locationController: ILocationController): Router {
  const router = Router();

  router.get('/search', locationController.search.bind(locationController));
  router.post('/set', authenticate, validateRequest(SetLocationDtoSchema), locationController.setLocation.bind(locationController));

  return router;
}
