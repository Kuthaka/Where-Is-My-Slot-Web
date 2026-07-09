import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './presentation/controllers/posts.controller';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { MongoosePostRepository } from './infrastructure/repositories/mongoose-post.repository';
import { POST_REPOSITORY } from './domain/repositories/post.repository.interface';
import { FlashDealsController } from './presentation/controllers/flash-deals.controller';
import { Post, PostSchema } from '../../models/post.schema';
import { Like, LikeSchema } from '../../models/like.schema';
import { Comment, CommentSchema } from '../../models/comment.schema';
import { FlashDeal, FlashDealSchema } from '../../models/flashdeal.schema';
import { Business, BusinessSchema } from '../../models/business.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: FlashDeal.name, schema: FlashDealSchema },
      { name: Business.name, schema: BusinessSchema },
    ]),
  ],
  controllers: [PostsController, FlashDealsController],
  providers: [
    CreatePostUseCase,
    { provide: POST_REPOSITORY, useClass: MongoosePostRepository }
  ],
})
export class PostsModule {}