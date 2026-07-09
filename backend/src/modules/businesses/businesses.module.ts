import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessesController } from './presentation/controllers/businesses.controller';
import { BUSINESS_REPOSITORY } from './domain/repositories/business.repository.interface';
import { MongooseBusinessRepository } from './infrastructure/repositories/mongoose-business.repository';
import { IMAGE_PROVIDER } from './application/interfaces/image.provider.interface';
import { CloudinaryImageProvider } from './infrastructure/providers/cloudinary.provider';
import { OnboardBusinessUseCase } from './application/use-cases/onboard-business.use-case';
import { UploadImageUseCase } from './application/use-cases/upload-image.use-case';
import { AdminManageBusinessUseCase } from './application/use-cases/admin-manage-business.use-case';
import { UpdateBusinessUseCase } from './application/use-cases/update-business.use-case';
import { Business, BusinessSchema } from '../../models/business.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Business.name, schema: BusinessSchema }]),
  ],
  controllers: [BusinessesController],
  providers: [
    OnboardBusinessUseCase,
    UploadImageUseCase,
    AdminManageBusinessUseCase,
    UpdateBusinessUseCase,
    {
      provide: BUSINESS_REPOSITORY,
      useClass: MongooseBusinessRepository,
    },
    {
      provide: IMAGE_PROVIDER,
      useClass: CloudinaryImageProvider,
    },
  ],
})
export class BusinessesModule {}
