import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { IParkingController } from '../interfaces/parking.controller.interface';
import { IParkingService } from '../../services/interfaces/parking.service.interface';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { sendSuccess } from '../../../../shared/middleware/response.middleware';
import { BadRequestError } from '../../../../shared/errors/app-error';
import { IBusinessRepository } from '../../../businesses/repositories/interfaces/business.repository.interface';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class ParkingController implements IParkingController {
  constructor(
    @inject(TYPES.ParkingService) private parkingService: IParkingService,
    @inject(TYPES.BusinessRepository) private businessRepository: IBusinessRepository
  ) {}

  // Helper to extract business ID
  private async getBusinessIdForUser(req: AuthenticatedRequest): Promise<string> {
    if (req.user!.type === 'business') {
      return req.user!.id;
    }
    const businesses = await this.businessRepository.findByOwnerId(req.user!.id);
    if (!businesses.length) throw new BadRequestError('User does not own a business');
    return businesses[0].props.id;
  }

  async searchParking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
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
    } catch (err) {
      next(err);
    }
  }

  async getParkingById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const parking = await this.parkingService.getParkingById(req.params.id);
      sendSuccess(res, parking);
    } catch (err) {
      next(err);
    }
  }

  async createBusinessParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const businessId = await this.getBusinessIdForUser(req);
      const parking = await this.parkingService.createBusinessParking(businessId, req.body);
      sendSuccess(res, parking, 201);
    } catch (err) {
      next(err);
    }
  }

  async getMyParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const businessId = await this.getBusinessIdForUser(req);
      const parkings = await this.parkingService.getBusinessParking(businessId);
      sendSuccess(res, parkings);
    } catch (err) {
      next(err);
    }
  }

  async updateBusinessParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const businessId = await this.getBusinessIdForUser(req);
      const parking = await this.parkingService.updateParking(req.params.id, businessId, req.body);
      sendSuccess(res, parking);
    } catch (err) {
      next(err);
    }
  }

  async updateAvailability(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const businessId = await this.getBusinessIdForUser(req);
      const { slots } = req.body;
      if (!slots) throw new BadRequestError('Slots payload is required');
      
      const parking = await this.parkingService.updateAvailability(req.params.id, businessId, slots);
      sendSuccess(res, parking);
    } catch (err) {
      next(err);
    }
  }

  async deleteBusinessParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const businessId = await this.getBusinessIdForUser(req);
      await this.parkingService.deleteParking(req.params.id, businessId);
      sendSuccess(res, { success: true });
    } catch (err) {
      next(err);
    }
  }

  async createCommunityParking(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // Must be a standard user
      if (req.user!.type === 'business') throw new BadRequestError('Businesses cannot submit community parking');
      
      const parking = await this.parkingService.createCommunityParking(req.user!.id, req.body);
      sendSuccess(res, parking, 201);
    } catch (err) {
      next(err);
    }
  }
}
