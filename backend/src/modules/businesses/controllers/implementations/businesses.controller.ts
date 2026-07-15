import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { IBusinessesController } from '../interfaces/businesses.controller.interface';
import { IBusinessesService } from '../../services/interfaces/businesses.service.interface';
import { IBusinessRepository } from '../../repositories/interfaces/business.repository.interface';
import { IUserRepository } from '../../../users/repositories/interfaces/user.repository.interface';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../../../shared/middleware/response.middleware';
import { BusinessModel } from '../../../../models/business.model';
import { uploadBuffer } from '../../../../shared/services/cloudinary.service';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../../../shared/errors/app-error';
import { User } from '../../../users/entities/user.entity';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Business } from '../../entities/business.entity';
import { IOtpService } from '../../../../shared/services/interfaces/otp.service.interface';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class BusinessesController implements IBusinessesController {
  constructor(
    @inject(TYPES.BusinessesService) private readonly businessesService: IBusinessesService,
    @inject(TYPES.BusinessRepository) private readonly businessRepository: IBusinessRepository,
    @inject(TYPES.OtpService) private readonly otpService: IOtpService,
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
  ) {}

  // ─── Public: Explore ──────────────────────────────────────────────────────────
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

  // ─── Authenticated Business: Get My Business ──────────────────────────────────
  async getMyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let business: Business | null = null;
      if (req.user!.type === 'business') {
        // Direct business account login
        business = await this.businessRepository.findById(req.user!.id);
      } else {
        // Legacy user-owned business
        const businesses = await this.businessRepository.findByOwnerId(req.user!.id);
        if (businesses.length > 0) business = businesses[0];
      }

      if (!business) {
        sendSuccess(res, null);
        return;
      }
      
      const { passwordHash, ...safeProps } = business.props;
      sendSuccess(res, safeProps);
    } catch (err) {
      next(err);
    }
  }

  // ─── Authenticated Business: Update ──────────────────────────────────────────
  async updateMyBusiness(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      let businessId: string;
      if (req.user!.type === 'business') {
        businessId = req.user!.id;
      } else {
        const businesses = await this.businessRepository.findByOwnerId(req.user!.id);
        if (businesses.length === 0) throw new NotFoundError('Business not found for the current user');
        businessId = businesses[0].props.id;
      }

      // Bypass service and update directly in repository since service uses ownerId logic
      const updateData = { props: { ...req.body } };
      const updated = await this.businessRepository.update(businessId, updateData as any);
      
      const { passwordHash, ...safeProps } = updated.props;
      sendSuccess(res, safeProps);
    } catch (err) {
      next(err);
    }
  }

  // ─── Public: Onboard (Register) ───────────────────────────────────────────────
  // Creates a new business account using the User collection for credentials and links the Business via ownerId
  async onboardBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, name, phone } = req.body;
      if (!email) throw new BadRequestError('Email is required');
      if (!password) throw new BadRequestError('Password is required');

      // Check if user already exists with this email
      let user = await this.userRepository.findByEmail(email);
      if (user) {
        if (user.role === UserRole.BUSINESS) {
          throw new BadRequestError('A business user with this email already exists. Please log in.');
        }
        // Promote legacy/regular user to business merchant
        const passwordHash = await bcrypt.hash(password, 10);
        user = await this.userRepository.update(user.id, {
          role: UserRole.BUSINESS,
          passwordHash,
          isPasswordSet: true,
        });
      } else {
        // Create new user with BUSINESS role
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User(
          uuidv4(),
          name || email.split('@')[0],
          null,
          email,
          passwordHash,
          true,
          UserRole.BUSINESS,
          true,
          new Date(),
          new Date()
        );
        user = await this.userRepository.create(newUser);
      }

      // Check if business profile already exists for this email
      const existingBusiness = await this.businessRepository.findByContactEmail(email);
      if (existingBusiness) {
        throw new BadRequestError('A business with this email already exists.');
      }

      // Now create the business linked to the User
      const business = await this.businessesService.onboardBusiness({
        ...req.body,
        ownerId: user.id,
        contactEmail: email,
        isVerified: true,
        status: 'APPROVED',
      });

      // Issue standard JWT token for the user session
      const secret = process.env.JWT_ACCESS_SECRET as string;
      const accessToken = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: '7d' }
      );

      const { passwordHash: _, ...safeProps } = business.props;
      sendCreated(res, { business: safeProps, accessToken });
    } catch (err) {
      next(err);
    }
  }

  // ─── Public: Business Login ───────────────────────────────────────────────────
  async businessLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new BadRequestError('Email and password are required');

      const user = await this.userRepository.findByEmail(email);
      if (!user) throw new UnauthorizedError('No account found with this email');
      
      if (user.role !== UserRole.BUSINESS && user.role !== UserRole.SUPER_ADMIN) {
        throw new UnauthorizedError('This account is not a business account.');
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) throw new UnauthorizedError('Invalid credentials');

      // Fetch the business associated with this ownerId
      const businesses = await this.businessRepository.findByOwnerId(user.id);
      if (businesses.length === 0) {
        throw new NotFoundError('No business profile is associated with this account.');
      }
      const business = businesses[0];

      const secret = process.env.JWT_ACCESS_SECRET as string;
      const accessToken = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: '7d' }
      );

      const { passwordHash, ...safeProps } = business.props;
      sendSuccess(res, { business: safeProps, accessToken });
    } catch (err) {
      next(err);
    }
  }

  // ─── Authenticated Business: Set/Change Password ─────────────────────────────
  async businessSetPassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { newPassword, oldPassword } = req.body;
      if (!newPassword) throw new BadRequestError('New password is required');

      const user = await this.userRepository.findById(req.user!.id);
      if (!user) throw new NotFoundError('User not found');

      if (user.isPasswordSet) {
        if (!oldPassword) throw new BadRequestError('Old password is required');
        const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isValid) throw new BadRequestError('Old password is incorrect');
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await this.userRepository.update(user.id, {
        passwordHash,
        isPasswordSet: true,
      });

      sendSuccess(res, { message: 'Password updated successfully' });
    } catch (err) {
      next(err);
    }
  }

  // ─── Public: Upload Image ─────────────────────────────────────────────────────
  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) throw new BadRequestError('No image file provided');
      const url = await uploadBuffer(req.file.buffer);
      sendSuccess(res, { url });
    } catch (err) {
      next(err);
    }
  }

  // ─── Public: Send OTP (Business Registration) ────────────────────────────────
  async businessSendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) throw new BadRequestError('Email is required');

      await this.otpService.sendOtp(email);

      sendSuccess(res, { message: `OTP sent to ${email}` });
    } catch (err) {
      next(err);
    }
  }

  // ─── Public: Verify OTP (Business Registration) ──────────────────────────────
  async businessVerifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) throw new BadRequestError('Email and OTP are required');

      await this.otpService.verifyOtp(email, otp);

      // Issue a short-lived "email-verified" token for the onboarding session
      const secret = process.env.JWT_ACCESS_SECRET as string;
      const verifiedToken = jwt.sign(
        { email, type: 'business-otp-verified' },
        secret,
        { expiresIn: '2h' }
      );

      sendSuccess(res, { verified: true, verifiedToken });
    } catch (err) {
      next(err);
    }
  }
}
