import { Module } from '@nestjs/common';
import { PostsController } from './presentation/controllers/posts.controller';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { PrismaPostRepository } from './infrastructure/repositories/prisma-post.repository';
import { POST_REPOSITORY } from './domain/repositories/post.repository.interface';

@Module({
  imports: [],
  controllers: [PostsController],
  providers: [
    CreatePostUseCase,
    { provide: POST_REPOSITORY, useClass: PrismaPostRepository }
  ],
})
export class PostsModule {}