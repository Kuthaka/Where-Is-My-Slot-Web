import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { MongooseUserRepository } from './infrastructure/repositories/mongoose-user.repository';
import { User, UserSchema } from '../../models/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: MongooseUserRepository,
    },
  ],
  exports: [USER_REPOSITORY, MongooseModule],
})
export class UsersModule {}
