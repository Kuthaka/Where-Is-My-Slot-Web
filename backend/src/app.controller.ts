import { Controller, Get, Post } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from './shared/enums/user-role.enum';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { User } from './models/user.schema';
import { Category } from './models/category.schema';
import { Business } from './models/business.schema';
import { Offer } from './models/offer.schema';

@Controller()
export class AppController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @InjectModel(Business.name) private readonly businessModel: Model<Business>,
    @InjectModel(Offer.name) private readonly offerModel: Model<Offer>,
  ) {}

  @Get('health')
  async checkHealth() {
    try {
      const state = this.connection.readyState;
      return {
        status: state === 1 ? 'ok' : 'error',
        database: state === 1 ? 'connected' : 'disconnected',
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
      let user = await this.userModel.findOne({ email: 'testowner@example.com' });
      if (!user) {
        user = await this.userModel.create({
          name: 'Test Owner',
          email: 'testowner@example.com',
          password: hashedPassword,
          role: UserRole.BUSINESS,
        });
      }

      // 2. Create a dummy category
      let category = await this.categoryModel.findOne({ name: 'Food & Beverage' });
      if (!category) {
        category = await this.categoryModel.create({
          name: 'Food & Beverage',
        });
      }

      // 3. Create a dummy business
      const business = await this.businessModel.create({
        ownerId: user._id.toString(),
        name: 'Social Offline',
        description: 'A great place to hang out and have drinks.',
        address: 'Indiranagar, Bangalore',
        latitude: 12.9783,
        longitude: 77.6408,
        isVerified: true,
      });

      // 4. Create an offer for the business
      const offer = await this.offerModel.create({
        businessId: business._id.toString(),
        title: 'Happy Hour Special 🍹',
        description: 'Get 1+1 on all cocktails until 8 PM today.',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        isActive: true,
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
