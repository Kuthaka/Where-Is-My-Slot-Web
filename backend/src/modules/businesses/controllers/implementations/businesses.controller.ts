import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { IBusinessesController } from '../interfaces/businesses.controller.interface';
import { IBusinessesService } from '../../services/interfaces/businesses.service.interface';
import { IBusinessRepository } from '../../repositories/interfaces/business.repository.interface';
import { IOtpRepository } from '../../../auth/repositories/interfaces/otp.repository.interface';
import { AuthenticatedRequest } from '../../../../shared/middleware/auth.middleware';
import { sendSuccess, sendCreated } from '../../../../shared/middleware/response.middleware';
import { BusinessModel } from '../../../../models/business.model';
import { uploadBuffer } from '../../../../core/services/cloudinary.service';
import { sendOtpEmail } from '../../../../core/services/email.service';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../../../shared/errors/app-error';
import { Otp } from '../../../auth/entities/otp.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Business } from '../../entities/business.entity';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../core/container/types';

@injectable()
export class BusinessesController implements IBusinessesController {
  constructor(
    @inject(TYPES.BusinessesService) private readonly businessesService: IBusinessesService,
    @inject(TYPES.BusinessRepository) private readonly businessRepository: IBusinessRepository,
    @inject(TYPES.OtpRepository) private readonly otpRepository: IOtpRepository,
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
  // Creates a new business account with hashed password (no user account needed)
  async onboardBusiness(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, name, phone, password } = req.body;
      if (!email) throw new BadRequestError('Email is required');
      if (!name) throw new BadRequestError('Business name is required');

      // Check if a business with this email already exists
      const existing = await this.businessRepository.findByContactEmail(email);
      if (existing) throw new BadRequestError('A business with this email is already registered. Please log in.');

      // Hash password — use provided password or generate a temporary random one
      const rawPassword = password || Math.random().toString(36).slice(-8) + 'A1!';
      const passwordHash = await bcrypt.hash(rawPassword, 10);

      const business = new Business({
        id: uuidv4(),
        ownerId: null,
        contactEmail: email,
        passwordHash,
        isPasswordSet: !!password,
        name,
        username: undefined,
        tagline: req.body.tagline ?? null,
        description: req.body.description ?? null,
        establishedYear: req.body.establishedYear ?? null,
        gstNumber: req.body.gstNumber ?? null,
        contactPerson: req.body.contactPerson ?? null,
        phone: phone ?? null,
        email: email,
        websiteUrl: req.body.websiteUrl ?? null,
        whatsappNumber: req.body.whatsappNumber ?? null,
        mobileNumbers: req.body.mobileNumbers ?? (phone ? [phone] : []),
        landlineNumbers: req.body.landlineNumbers ?? [],
        emails: req.body.emails ?? [email],
        address: req.body.address ?? null,
        pincode: req.body.pincode ?? null,
        plotNo: req.body.plotNo ?? null,
        buildingName: req.body.buildingName ?? null,
        streetName: req.body.streetName ?? null,
        landmark: req.body.landmark ?? null,
        area: req.body.area ?? null,
        city: req.body.city ?? null,
        state: req.body.state ?? null,
        latitude: req.body.latitude ?? null,
        longitude: req.body.longitude ?? null,
        googleMapsUrl: req.body.googleMapsUrl ?? null,
        timings: req.body.timings ?? null,
        primaryCategory: req.body.primaryCategory ?? null,
        subCategories: req.body.subCategories ?? [],
        amenities: req.body.amenities ?? [],
        parking: req.body.parking ?? null,
        logo: req.body.logo ?? null,
        coverPhoto: req.body.coverPhoto ?? null,
        images: req.body.images ?? [],
        socialLinks: req.body.socialLinks ?? null,
        isVerified: false,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const saved = await this.businessRepository.create(business);

      // Issue a JWT for immediate session (type: 'business')
      const secret = process.env.JWT_ACCESS_SECRET as string;
      const accessToken = jwt.sign(
        { sub: saved.props.id, email: saved.props.contactEmail, type: 'business' },
        secret,
        { expiresIn: '7d' }
      );

      const { passwordHash: _, ...safeProps } = saved.props;
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

      const business = await this.businessRepository.findByContactEmail(email);
      if (!business) throw new UnauthorizedError('No business account found with this email');
      if (!business.props.passwordHash) throw new UnauthorizedError('Password not set. Please contact support.');

      const isValid = await bcrypt.compare(password, business.props.passwordHash);
      if (!isValid) throw new UnauthorizedError('Invalid credentials');

      const secret = process.env.JWT_ACCESS_SECRET as string;
      const accessToken = jwt.sign(
        { sub: business.props.id, email: business.props.contactEmail, type: 'business' },
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

      const business = await this.businessRepository.findById(req.user!.id);
      if (!business) throw new NotFoundError('Business not found');

      if (business.props.isPasswordSet) {
        if (!oldPassword) throw new BadRequestError('Old password is required');
        const isValid = await bcrypt.compare(oldPassword, business.props.passwordHash!);
        if (!isValid) throw new BadRequestError('Old password is incorrect');
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await this.businessRepository.update(business.props.id, {
        props: { passwordHash, isPasswordSet: true }
      } as any);

      sendSuccess(res, { success: true, message: 'Password updated successfully' });
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

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

      console.log(`\n=========================================\n[OTP GENERATED] Email: ${email} | Code: ${otp}\n=========================================\n`);

      await this.otpRepository.create(new Otp(uuidv4(), email, otp, expiresAt, new Date()));
      await sendOtpEmail(email, otp);

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

      const record = await this.otpRepository.findLatestValidOtp(email, otp);
      if (!record) throw new BadRequestError('Invalid or expired OTP. Please request a new one.');

      // Delete the OTP so it can't be reused
      await this.otpRepository.delete(record.id);

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
