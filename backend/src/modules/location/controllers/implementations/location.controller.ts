import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { ILocationController } from '../interfaces/location.controller.interface';
import { ILocationService } from '../../services/interfaces/location.service.interface';
import { TYPES } from '../../../../core/container/types';
import { sendSuccess } from '../../../../shared/middleware/response.middleware';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { BadRequestError } from '../../../../shared/errors/app-error';

@injectable()
export class LocationController implements ILocationController {
  constructor(
    @inject(TYPES.LocationService) private readonly locationService: ILocationService
  ) {}

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        throw new BadRequestError('Search query is required');
      }

      const results = await this.locationService.searchLocation(query);
      sendSuccess(res, { results });
    } catch (err) {
      next(err);
    }
  }

  async setLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const { address, latitude, longitude } = req.body;
      
      await this.locationService.setUserLocation(userId, address, latitude, longitude);
      sendSuccess(res, { message: 'Location set successfully' });
    } catch (err) {
      next(err);
    }
  }
}
