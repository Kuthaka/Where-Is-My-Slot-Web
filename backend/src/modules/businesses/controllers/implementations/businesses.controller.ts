import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { IBusinessesController } from '../interfaces/businesses.controller.interface';
import { IBusinessesService } from '../../services/interfaces/businesses.service.interface';
import { IBusinessRepository } from '../../repositories/interfaces/business.repository.interface';
import { IUserRepository } from '../../../users/repositories/interfaces/user.repository.interface';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../../../shared/middleware/response.middleware';
import { BusinessModel } from '../../../../models/business.model';
import { uploadBuffer } from '../../../../core/services/cloudinary.service';
import { BadRequestError } from '../../../../shared/errors/app-error';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { User } from '../../../users/entities/user.entity';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class BusinessesController implements IBusinessesController {
  constructor(
    @inject(TYPES.BusinessesService) private readonly businessesService: IBusinessesService,
    @inject(TYPES.BusinessRepository) private readonly businessRepository: IBusinessRepository,
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository
  ) {}

  async exploreBusinesses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, category, cursor, limit } = req.query as Record<string, string>;
      const take = limit ? Math.min(parseInt(limit, 10), 20) : 12;
      const where: Record<string, unknown> = { status: 'APPROVED' };

      if (search) {
        where.$or = [
          { name: { $regex: search, $options: 'i' } },
          { tagline: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { area: { $regex: search, $options: 'i' } },
          { city: { $regex: search, $options: 'i' } },
          { primaryCategory: { $regex: search, $options: 'i' } },
        ];
      }

      if (category && category !== 'All') {
        where.primaryCategory = { $regex: category, $options: 'i' };
      }

      if (cursor) {
        where._id = { $lt: new Types.ObjectId(cursor) };
      }

      const businesses = await BusinessModel.find(where)
        .sort({ isVerified: -1, createdAt: -1 })
        .limit(take + 1)
        .select('name username tagline description primaryCategory subCategories logo coverPhoto area city isVerified phone googleMapsUrl')
        .exec();

      const hasMore = businesses.length > take;
      const items = hasMore ? businesses.slice(0, take) : businesses;
      const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

      const formatted = items.map((b: any) => ({
        ...b.toObject(),
        id: b._id.toString(),
        _count: { posts: 0, flashDeals: 0 },
        flashDeals: [],
      }));

      sendSuccess(res, { businesses: formatted, nextCursor, hasMore });
    } catch (err) {
      next(err);
    }
  }

  async getMyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const businesses = await this.businessRepository.findByOwnerId(req.user!.id);
      if (businesses.length === 0) {
        sendSuccess(res, null);
        return;
      }
      sendSuccess(res, businesses[0].props);
    } catch (err) {
      next(err);
    }
  }

  async updateMyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await this.businessesService.updateBusiness(req.user!.id, req.body);
      sendSuccess(res, updated.props);
    } catch (err) {
      next(err);
    }
  }

  async onboardBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = req.body.email;
      if (!email) throw new BadRequestError('Email is required for onboarding');

      let user = await this.userRepository.findByEmail(email);

      if (!user) {
        const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
        const newUser = new User(
          uuidv4(),
          req.body.name || email.split('@')[0],
          null,
          email,
          randomPassword,
          false,
          UserRole.BUSINESS,
          true,
          new Date(),
          new Date()
        );
        user = await this.userRepository.create(newUser);
      } else if (user.role === UserRole.USER) {
        user = await this.userRepository.update(user.id, { role: UserRole.BUSINESS });
      }

      const business = await this.businessesService.onboardBusiness({
        ownerId: user.id,
        ...req.body,
      });

      const secret = process.env.JWT_ACCESS_SECRET as string;
      const payload = { sub: user.id, email: user.email, role: user.role };
      const accessToken = jwt.sign(payload, secret, { expiresIn: '7d' });

      sendCreated(res, { business: business.props, accessToken });
    } catch (err) {
      next(err);
    }
  }

  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) throw new BadRequestError('No image file provided');
      const url = await uploadBuffer(req.file.buffer);
      sendSuccess(res, { url });
    } catch (err) {
      next(err);
    }
  }
}

