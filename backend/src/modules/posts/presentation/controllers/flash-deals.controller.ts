import { Controller, Post, Body, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { PrismaService } from '../../../../shared/database/prisma.service';

@Controller('flash-deals')
export class FlashDealsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFlashDeal(
    @CurrentUser() user: any,
    @Body() data: { offer: string; image: string; type?: string; navigateLink?: string }
  ) {
    const business = await this.prisma.business.findFirst({ where: { ownerId: user.id } });
    if (!business) throw new Error('Business not found');
    
    return this.prisma.flashDeal.create({
      data: {
        businessId: business.id,
        offer: data.offer,
        image: data.image,
        type: data.type || 'DISCOUNT',
        navigateLink: data.navigateLink || null,
        activeUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      }
    });
  }

  @Get()
  async getFlashDeals(@Query('businessId') businessId?: string) {
    const where = businessId 
      ? { businessId, activeUntil: { gt: new Date() } } 
      : { activeUntil: { gt: new Date() } };
      
    return this.prisma.flashDeal.findMany({
      where,
      include: { business: { select: { id: true, name: true, logo: true, isVerified: true, username: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
