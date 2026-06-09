import { Module } from '@nestjs/common';
import { BusinessesController } from './presentation/controllers/businesses.controller';
import { BUSINESS_REPOSITORY } from './domain/repositories/business.repository.interface';
import { PrismaBusinessRepository } from './infrastructure/repositories/prisma-business.repository';
import { IMAGE_PROVIDER } from './application/interfaces/image.provider.interface';
import { CloudinaryImageProvider } from './infrastructure/providers/cloudinary.provider';
import { OnboardBusinessUseCase } from './application/use-cases/onboard-business.use-case';
import { UploadImageUseCase } from './application/use-cases/upload-image.use-case';
import { PrismaService } from '../../shared/database/prisma.service';

@Module({
  controllers: [BusinessesController],
  providers: [
    PrismaService,
    OnboardBusinessUseCase,
    UploadImageUseCase,
    {
      provide: BUSINESS_REPOSITORY,
      useClass: PrismaBusinessRepository,
    },
    {
      provide: IMAGE_PROVIDER,
      useClass: CloudinaryImageProvider,
    },
  ],
})
export class BusinessesModule {}
