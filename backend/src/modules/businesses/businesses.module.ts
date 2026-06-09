import { Module } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { CloudinaryProvider } from '../../core/config/cloudinary.provider';

@Module({
  controllers: [BusinessesController],
  providers: [CloudinaryProvider]
})
export class BusinessesModule {}
