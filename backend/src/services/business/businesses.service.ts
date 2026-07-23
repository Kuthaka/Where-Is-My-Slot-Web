import { IBusinessesService } from '../../core/interfaces/services/business/businesses.service.interface';
import { IBusinessRepository, IExploreBusinessesFilters, IExploreBusinessesResult } from '../../core/interfaces/repositories/business/business.repository.interface';
import { BusinessDto } from '../../dtos/business/business.dto';
import { IUserRepository } from '../../core/interfaces/repositories/user/user.repository.interface';
import { IOtpService } from '../../shared/services/interfaces/otp.service.interface';
import { BadRequestError, UnauthorizedError, NotFoundError } from '../../shared/errors/app-error';
import { UserDto } from '../../dtos/user/user.dto';
import { UserRole } from '../../shared/enums/user-role.enum';
import { uploadBuffer } from '../../shared/services/cloudinary.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/container/types';

@injectable()
export class BusinessesService implements IBusinessesService {
  constructor(
    @inject(TYPES.BusinessRepository) private readonly businessRepository: IBusinessRepository,
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository,
    @inject(TYPES.OtpService) private readonly otpService: IOtpService
  ) {}

  async exploreBusinesses(filters: IExploreBusinessesFilters): Promise<IExploreBusinessesResult> {
    return this.businessRepository.exploreBusinesses(filters);
  }

  async getBusinessById(id: string): Promise<BusinessDto | null> {
    return this.businessRepository.findById(id);
  }

  async getMyBusiness(userId: string, isBusinessUser: boolean): Promise<BusinessDto | null> {
    if (isBusinessUser) {
      return this.businessRepository.findById(userId);
    } else {
      const businesses = await this.businessRepository.findByOwnerId(userId);
      return businesses.length > 0 ? businesses[0] : null;
    }
  }

  async updateMyBusiness(userId: string, isBusinessUser: boolean, data: Record<string, any>): Promise<BusinessDto> {
    let businessId: string;
    if (isBusinessUser) {
      businessId = userId;
    } else {
      const businesses = await this.businessRepository.findByOwnerId(userId);
      if (businesses.length === 0) throw new NotFoundError('BusinessDto not found for the current user');
      businessId = businesses[0].id;
    }

    let { logo, coverPhoto, ...otherProps } = data;

    if (logo && logo.startsWith('data:image')) {
      const base64Data = logo.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      logo = await uploadBuffer(buffer);
    }

    if (coverPhoto && coverPhoto.startsWith('data:image')) {
      const base64Data = coverPhoto.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      coverPhoto = await uploadBuffer(buffer);
    }

    const updateData: any = { ...otherProps };
    if (logo) updateData.logo = logo;
    if (coverPhoto) updateData.coverPhoto = coverPhoto;

    return this.businessRepository.update(businessId, updateData as any);
  }

  async onboardBusiness(data: Record<string, unknown>): Promise<{ business: BusinessDto; accessToken: string }> {
    const email = data.email as string;
    const password = data.password as string;
    const name = data.name as string;

    if (!email) throw new BadRequestError('Email is required');
    if (!password) throw new BadRequestError('Password is required');

    let user = await this.userRepository.findByEmail(email);
    if (user) {
      if (user.role === UserRole.BUSINESS) {
        throw new BadRequestError('A business user with this email already exists. Please log in.');
      }
      const passwordHash = await bcrypt.hash(password, 10);
      user = await this.userRepository.update(user.id, {
        role: UserRole.BUSINESS,
        passwordHash,
        isPasswordSet: true,
      });
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser: Partial<UserDto> = {
        name: name || email.split('@')[0],
        username: null,
        email,
        passwordHash,
        isPasswordSet: true,
        role: UserRole.BUSINESS,
        isActive: true,
      };
      user = await this.userRepository.create(newUser);
    }

    const existingBusiness = await this.businessRepository.findByContactEmail(email);
    if (existingBusiness) {
      throw new BadRequestError('A business with this email already exists.');
    }

    const businessData: any = {
      ...data,
      ownerId: user.id,
      contactEmail: email,
      isVerified: true,
      status: 'APPROVED',
    };

    const business: Partial<BusinessDto> = {
      id: uuidv4(),
      ownerId: (businessData.ownerId as string) ?? null,
      contactEmail: (businessData.contactEmail as string) ?? (businessData.email as string) ?? '',
      passwordHash: (businessData.passwordHash as string) ?? null,
      isPasswordSet: (businessData.isPasswordSet as boolean) ?? false,
      name: businessData.name as string,
      username: (businessData.username as string) || undefined,
      tagline: (businessData.tagline as string) ?? null,
      description: (businessData.description as string) ?? null,
      establishedYear: (businessData.establishedYear as number) ?? null,
      gstNumber: (businessData.gstNumber as string) ?? null,
      contactPerson: (businessData.contactPerson as string) ?? null,
      phone: (businessData.phone as string) ?? null,
      email: (businessData.email as string) ?? null,
      websiteUrl: (businessData.websiteUrl as string) ?? null,
      whatsappNumber: (businessData.whatsappNumber as string) ?? null,
      mobileNumbers: (businessData.mobileNumbers as string[]) ?? [],
      landlineNumbers: (businessData.landlineNumbers as string[]) ?? [],
      emails: (businessData.emails as string[]) ?? [],
      address: (businessData.address as string) ?? null,
      pincode: (businessData.pincode as string) ?? null,
      plotNo: (businessData.plotNo as string) ?? null,
      buildingName: (businessData.buildingName as string) ?? null,
      streetName: (businessData.streetName as string) ?? null,
      landmark: (businessData.landmark as string) ?? null,
      area: (businessData.area as string) ?? null,
      city: (businessData.city as string) ?? null,
      state: (businessData.state as string) ?? null,
      latitude: (businessData.latitude as number) ?? null,
      longitude: (businessData.longitude as number) ?? null,
      googleMapsUrl: (businessData.googleMapsUrl as string) ?? null,
      timings: (businessData.timings as Record<string, unknown>) ?? null,
      primaryCategory: (businessData.primaryCategory as string) ?? null,
      subCategories: (businessData.subCategories as string[]) ?? [],
      amenities: (businessData.amenities as string[]) ?? [],
      parking: (businessData.parking as Record<string, unknown>) ?? null,
      logo: (businessData.logo as string) ?? null,
      coverPhoto: (businessData.coverPhoto as string) ?? null,
      images: (businessData.images as string[]) ?? [],
      socialLinks: (businessData.socialLinks as Record<string, unknown>) ?? null,
      isVerified: businessData.isVerified as boolean,
      status: businessData.status as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdBusiness = await this.businessRepository.create(business);

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    return { business: createdBusiness, accessToken };
  }

  async businessLogin(data: Record<string, unknown>): Promise<{ business: BusinessDto; accessToken: string }> {
    const email = data.email as string;
    const password = data.password as string;

    if (!email || !password) throw new BadRequestError('Email and password are required');

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('No account found with this email');
    
    if (user.role !== UserRole.BUSINESS && user.role !== UserRole.SUPER_ADMIN) {
      throw new UnauthorizedError('This account is not a business account.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash || "");
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

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

    return { business, accessToken };
  }

  async businessSetPassword(userId: string, data: Record<string, unknown>): Promise<void> {
    const newPassword = data.newPassword as string;
    const oldPassword = data.oldPassword as string;

    if (!newPassword) throw new BadRequestError('New password is required');

    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('UserDto not found');

    if (user.isPasswordSet) {
      if (!oldPassword) throw new BadRequestError('Old password is required');
      const isValid = await bcrypt.compare(oldPassword, user.passwordHash || "");
      if (!isValid) throw new BadRequestError('Old password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(user.id, {
      passwordHash,
      isPasswordSet: true,
    });
  }

  async uploadImage(fileBuffer: Buffer): Promise<string> {
    return uploadBuffer(fileBuffer);
  }

  async businessSendOtp(email: string): Promise<void> {
    if (!email) throw new BadRequestError('Email is required');
    await this.otpService.sendOtp(email);
  }

  async businessVerifyOtp(email: string, otp: string): Promise<{ verified: boolean; verifiedToken: string }> {
    if (!email || !otp) throw new BadRequestError('Email and OTP are required');

    await this.otpService.verifyOtp(email, otp);

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const verifiedToken = jwt.sign(
      { email, type: 'business-otp-verified' },
      secret,
      { expiresIn: '2h' }
    );

    return { verified: true, verifiedToken };
  }
}
