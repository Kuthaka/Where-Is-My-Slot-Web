import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { ILocationController } from '../../core/interfaces/controllers/user/location.controller.interface';
import { ILocationService } from '../../core/interfaces/services/user/location.service.interface';
import { TYPES } from '../../core/container/types';
import { sendSuccess } from '../../shared/middleware/response.middleware';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { BadRequestError } from '../../shared/errors/app-error';
import { catchAsync } from '../../shared/utils/catch-async';

@injectable()
export class LocationController implements ILocationController {
  constructor(
    @inject(TYPES.LocationService) private readonly locationService: ILocationService
  ) {}

  search = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      throw new BadRequestError('Search query is required');
    }

    const results = await this.locationService.searchLocation(query);
    sendSuccess(res, { results });
  });

  setLocation = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user!.id;
    const { address, latitude, longitude } = req.body;
    
    await this.locationService.setUserLocation(userId, address, latitude, longitude);
    sendSuccess(res, { message: 'Location set successfully' });
  });
}
