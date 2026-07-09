import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BusinessesModule } from './modules/businesses/businesses.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OffersModule } from './modules/offers/offers.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { PostsModule } from './modules/posts/posts.module';

import { User, UserSchema } from './models/user.schema';
import { Category, CategorySchema } from './models/category.schema';
import { Business, BusinessSchema } from './models/business.schema';
import { Offer, OfferSchema } from './models/offer.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRoot(process.env.DATABASE_URL as string),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Business.name, schema: BusinessSchema },
      { name: Offer.name, schema: OfferSchema },
    ]),
    AuthModule,
    UsersModule,
    BusinessesModule,
    CategoriesModule,
    OffersModule,
    NotificationsModule,
    AdminModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
