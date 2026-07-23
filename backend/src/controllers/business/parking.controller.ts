import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { IParkingController } from '../../core/interfaces/controllers/business/parking.controller.interface';
import { IParkingService } from '../../core/interfaces/services/business/parking.service.interface';
import { AuthenticatedRequest } from '../../shared/middleware/auth.middleware';
import { sendSuccess } from '../../shared/middleware/response.middleware';
import { BadRequestError } from '../../shared/errors/app-error';
import { TYPES } from '../../core/container/types';
import { catchAsync } from '../../shared/utils/catch-async';

@injectable()
export class ParkingController implements IParkingController {
  constructor(
    @inject(TYPES.ParkingService) private parkingService: IParkingService
  ) {}

  searchParking = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { lat, lng, radius, isFree, type, source } = req.query;
    
    if (!lat || !lng) throw new BadRequestError('Latitude (lat) and Longitude (lng) are required');

    const filters: any = {};
    if (isFree === 'true') filters.isFree = true;
    if (type) filters.type = type;
    if (source) filters.source = source;

    const results = await this.parkingService.findNearbyParking(
      parseFloat(lat as string),
      parseFloat(lng as string),
      radius ? parseInt(radius as string) : 5000,
      filters
    );

    sendSuccess(res, results);
  });

  getParkingById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const parking = await this.parkingService.getParkingById(req.params.id);
    sendSuccess(res, parking);
  });

  createBusinessParking = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const isBusinessUser = req.user!.type === 'business';
    const parking = await this.parkingService.createBusinessParking(req.user!.id, isBusinessUser, req.body);
    sendSuccess(res, parking, 201);
  });

  getMyParking = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const isBusinessUser = req.user!.type === 'business';
    const parkings = await this.parkingService.getBusinessParking(req.user!.id, isBusinessUser);
    sendSuccess(res, parkings);
  });

  updateBusinessParking = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const isBusinessUser = req.user!.type === 'business';
    const parking = await this.parkingService.updateParking(req.params.id, req.user!.id, isBusinessUser, req.body);
    sendSuccess(res, parking);
  });

  updateAvailability = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const isBusinessUser = req.user!.type === 'business';
    const { slots } = req.body;
    if (!slots) throw new BadRequestError('Slots payload is required');
    
    const parking = await this.parkingService.updateAvailability(req.params.id, req.user!.id, isBusinessUser, slots);
    sendSuccess(res, parking);
  });

  deleteBusinessParking = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const isBusinessUser = req.user!.type === 'business';
    await this.parkingService.deleteParking(req.params.id, req.user!.id, isBusinessUser);
    sendSuccess(res, { success: true });
  });

  createCommunityParking = catchAsync(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    if (req.user!.type === 'business') throw new BadRequestError('Businesses cannot submit community parking');
    
    const parking = await this.parkingService.createCommunityParking(req.user!.id, req.body);
    sendSuccess(res, parking, 201);
  });
}
