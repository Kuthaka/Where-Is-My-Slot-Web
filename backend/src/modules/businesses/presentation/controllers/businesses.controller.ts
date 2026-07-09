import { Controller, Post, Get, Body, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Param, Query, Inject } from '@nestjs/common';
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
import { Patch } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Business } from '../../../../models/business.schema';

@Controller('businesses')
export class BusinessesController {
  constructor(
    private readonly onboardBusinessUseCase: OnboardBusinessUseCase,
    private readonly uploadImageUseCase: UploadImageUseCase,
    private readonly adminManageBusinessUseCase: AdminManageBusinessUseCase,
    private readonly updateBusinessUseCase: UpdateBusinessUseCase,
    @Inject(BUSINESS_REPOSITORY)
    private readonly businessRepository: IBusinessRepository,
    @InjectModel(Business.name) private readonly businessModel: Model<Business>,
  ) {}

  @Get('explore')
  async exploreBusinesses(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const take = limit ? Math.min(parseInt(limit, 10), 20) : 12;
    const where: any = { status: 'APPROVED' };

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

    const businesses = await this.businessModel.find(where)
      .sort({ isVerified: -1, createdAt: -1 })
      .limit(take + 1)
      .select('name username tagline description primaryCategory subCategories logo coverPhoto area city isVerified phone googleMapsUrl')
      .exec();

    const hasMore = businesses.length > take;
    const items = hasMore ? businesses.slice(0, take) : businesses;
    const nextCursor = hasMore ? items[items.length - 1]._id.toString() : null;

    const formattedItems = items.map(b => ({
      ...b.toObject(),
      id: b._id.toString(),
      _count: { posts: 0, flashDeals: 0 },
      flashDeals: []
    }));

    return { businesses: formattedItems, nextCursor, hasMore };
  }

  @Post('onboard')
  @UseGuards(JwtAuthGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS, UserRole.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }
    return this.uploadImageUseCase.execute(file.buffer);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS, UserRole.SUPER_ADMIN)
  async getMyBusiness(@CurrentUser() user: any) {
    const businesses = await this.businessRepository.findByOwnerId(user.id);
    if (businesses.length === 0) return null;
    return businesses[0].props;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.BUSINESS, UserRole.SUPER_ADMIN)
  async updateMyBusiness(
    @CurrentUser() user: any,
    @Body() data: UpdateBusinessDto,
  ) {
    const updatedBusiness = await this.updateBusinessUseCase.execute(user.id, data);
    return updatedBusiness.props;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async getAllBusinesses() {
    const businesses = await this.adminManageBusinessUseCase.getAllBusinesses();
    return businesses.map(b => b.props);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async approveBusiness(@Param('id') id: string) {
    const business = await this.adminManageBusinessUseCase.approveBusiness(id);
    return business.props;
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async rejectBusiness(@Param('id') id: string) {
    const business = await this.adminManageBusinessUseCase.rejectBusiness(id);
    return business.props;
  }

  @Post('admin/add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async adminAddBusiness(@Body() body: OnboardBusinessDto) {
    return this.adminManageBusinessUseCase.createAdminBusiness(body);
  }
}
