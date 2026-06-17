import { Controller, Post, Get, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { UserRole } from '../../../../shared/enums/user-role.enum';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { OnboardBusinessDto } from '../../application/dto/onboard-business.dto';
import { OnboardBusinessUseCase } from '../../application/use-cases/onboard-business.use-case';
import { UploadImageUseCase } from '../../application/use-cases/upload-image.use-case';

import { AdminManageBusinessUseCase } from '../../application/use-cases/admin-manage-business.use-case';
import { UpdateBusinessUseCase } from '../../application/use-cases/update-business.use-case';
import { UpdateBusinessDto } from '../../application/dto/update-business.dto';
import { BUSINESS_REPOSITORY, IBusinessRepository } from '../../domain/repositories/business.repository.interface';
import { Inject, Patch } from '@nestjs/common';

@Controller('businesses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessesController {
  constructor(
    private readonly onboardBusinessUseCase: OnboardBusinessUseCase,
    private readonly uploadImageUseCase: UploadImageUseCase,
    private readonly adminManageBusinessUseCase: AdminManageBusinessUseCase,
    private readonly updateBusinessUseCase: UpdateBusinessUseCase,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
  ) {}

  @Post('onboard')
  @Roles(UserRole.BUSINESS, UserRole.SUPER_ADMIN)
  async onboardBusiness(
    @CurrentUser() user: any,
    @Body() body: OnboardBusinessDto,
  ) {
    return this.onboardBusinessUseCase.execute({
      ownerId: user.id,
      ...body,
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

  @Get('me')
  @Roles(UserRole.BUSINESS, UserRole.SUPER_ADMIN)
  async getMyBusiness(@CurrentUser() user: any) {
    const businesses = await this.businessRepository.findByOwnerId(user.id);
    if (businesses.length === 0) return null;
    return businesses[0].props; // Return the first business associated with user
  }

  @Patch('me')
  @Roles(UserRole.BUSINESS, UserRole.SUPER_ADMIN)
  async updateMyBusiness(
    @CurrentUser() user: any,
    @Body() data: UpdateBusinessDto,
  ) {
    const updatedBusiness = await this.updateBusinessUseCase.execute(user.id, data);
    return updatedBusiness.props;
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  async getAllBusinesses() {
    const businesses = await this.adminManageBusinessUseCase.getAllBusinesses();
    return businesses.map(b => b.props);
  }

  @Post(':id/approve')
  @Roles(UserRole.SUPER_ADMIN)
  async approveBusiness(@Param('id') id: string) {
    const business = await this.adminManageBusinessUseCase.approveBusiness(id);
    return business.props;
  }

  @Post(':id/reject')
  @Roles(UserRole.SUPER_ADMIN)
  async rejectBusiness(@Param('id') id: string) {
    const business = await this.adminManageBusinessUseCase.rejectBusiness(id);
    return business.props;
  }

  @Post('admin/add')
  @Roles(UserRole.SUPER_ADMIN)
  async adminAddBusiness(@Body() body: OnboardBusinessDto) {
    return this.adminManageBusinessUseCase.createAdminBusiness(body);
  }
}
