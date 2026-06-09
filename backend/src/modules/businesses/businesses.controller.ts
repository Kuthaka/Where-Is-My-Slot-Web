import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/user-role.enum';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { IsString, IsEmail, IsOptional, IsArray, IsObject, Allow } from 'class-validator';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export class OnboardBusinessDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  address!: string;

  @Allow()
  timings?: any;

  @Allow()
  parking?: any;

  @IsArray()
  @IsString({ each: true })
  images!: string[];
}

@Controller('businesses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessesController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('onboard')
  @Roles(UserRole.BUSINESS, UserRole.SUPER_ADMIN)
  async onboardBusiness(
    @CurrentUser() user: any,
    @Body() body: OnboardBusinessDto,
  ) {
    const business = await this.prisma.business.create({
      data: {
        ownerId: user.id,
        name: body.name,
        description: body.description,
        email: body.email,
        phone: body.phone,
        address: body.address,
        timings: body.timings,
        parking: body.parking,
        images: body.images,
        isVerified: false,
      },
    });

    return business;
  }

  @Post('upload-image')
  @Roles(UserRole.BUSINESS, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const toStream = require('buffer-to-stream');
    
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'whereismyslot/businesses' },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result?.secure_url });
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
