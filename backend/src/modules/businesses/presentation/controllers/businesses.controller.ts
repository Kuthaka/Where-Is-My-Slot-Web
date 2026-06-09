import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { OnboardBusinessDto } from '../../application/dto/onboard-business.dto';
import { OnboardBusinessUseCase } from '../../application/use-cases/onboard-business.use-case';
import { UploadImageUseCase } from '../../application/use-cases/upload-image.use-case';

@Controller('businesses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessesController {
  constructor(
    private readonly onboardBusinessUseCase: OnboardBusinessUseCase,
    private readonly uploadImageUseCase: UploadImageUseCase,
  ) {}

  @Post('onboard')
  @Roles(UserRole.BUSINESS, UserRole.SUPER_ADMIN)
  async onboardBusiness(
    @CurrentUser() user: any,
    @Body() body: OnboardBusinessDto,
  ) {
    return this.onboardBusinessUseCase.execute({
      ownerId: user.id,
      name: body.name,
      description: body.description,
      email: body.email,
      phone: body.phone,
      address: body.address,
      timings: body.timings,
      parking: body.parking,
      images: body.images,
    });
  }

  @Post('upload-image')
  @Roles(UserRole.BUSINESS, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }
    return this.uploadImageUseCase.execute(file.buffer);
  }
}
