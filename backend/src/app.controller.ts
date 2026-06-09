import { Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from './shared/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from './shared/enums/user-role.enum';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('health')
  async checkHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Post('seed')
  async seedData() {
    try {
      const hashedPassword = await bcrypt.hash('password123', 10);

      // 1. Create a dummy user
      const user = await this.prisma.user.upsert({
        where: { email: 'testowner@example.com' },
        update: {},
        create: {
          name: 'Test Owner',
          email: 'testowner@example.com',
          password: hashedPassword,
          role: UserRole.BUSINESS,
        },
      });

      // 2. Create a dummy category
      const category = await this.prisma.category.upsert({
        where: { name: 'Food & Beverage' },
        update: {},
        create: {
          name: 'Food & Beverage',
        },
      });

      // 3. Create a dummy business
      const business = await this.prisma.business.create({
        data: {
          ownerId: user.id,
          name: 'Social Offline',
          description: 'A great place to hang out and have drinks.',
          address: 'Indiranagar, Bangalore',
          latitude: 12.9783,
          longitude: 77.6408,
          isVerified: true,
        },
      });

      // 4. Create an offer for the business
      const offer = await this.prisma.offer.create({
        data: {
          businessId: business.id,
          title: 'Happy Hour Special 🍹',
          description: 'Get 1+1 on all cocktails until 8 PM today.',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
          isActive: true,
        },
      });

      return {
        message: 'Database seeded successfully!',
        data: { user, category, business, offer },
      };
    } catch (error: any) {
      return {
        message: 'Failed to seed database.',
        error: error.message,
      };
    }
  }
}
