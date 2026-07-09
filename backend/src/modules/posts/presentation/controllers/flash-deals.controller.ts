import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Business } from '../../../../models/business.schema';
import { FlashDeal } from '../../../../models/flashdeal.schema';

@Controller('flash-deals')
export class FlashDealsController {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<Business>,
    @InjectModel(FlashDeal.name) private flashDealModel: Model<FlashDeal>
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFlashDeal(
    @CurrentUser() user: any,
    @Body() data: { offer: string; image: string; type?: string; navigateLink?: string }
  ) {
    const business = await this.businessModel.findOne({ ownerId: user.id }).exec();
    if (!business) throw new Error('Business not found');
    
    return this.flashDealModel.create({
      businessId: business._id.toString(),
      offer: data.offer,
      image: data.image,
      type: data.type || 'DISCOUNT',
      navigateLink: data.navigateLink || undefined,
      activeUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    });
  }

  @Get()
  async getFlashDeals(@Query('businessId') businessId?: string) {
    const where: any = { activeUntil: { $gt: new Date() } };
    if (businessId) where.businessId = new Types.ObjectId(businessId);
      
    const deals = await this.flashDealModel.find(where).sort({ createdAt: -1 }).exec();
    
    // Populate business manually or use Mongoose populate if refs are set correctly
    return Promise.all(deals.map(async deal => {
      const business = await this.businessModel.findById(deal.businessId).exec();
      return {
        ...deal.toObject(),
        business: business ? { id: business._id, name: business.name, logo: business.logo, isVerified: business.isVerified, username: business.username } : null
      };
    }));
  }
}
