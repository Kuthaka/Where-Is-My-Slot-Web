import * as fs from 'fs';
import * as path from 'path';

const basePath = path.join(__dirname, 'src', 'modules', 'posts');
const dirs = [
  'application/use-cases',
  'domain/entities',
  'domain/repositories',
  'infrastructure/repositories',
  'presentation/controllers',
  'presentation/dtos'
];

dirs.forEach(d => fs.mkdirSync(path.join(basePath, d), { recursive: true }));

const files = {
  'domain/entities/post.entity.ts': `
export class Post {
  constructor(public props: any) {}
}`,
  'domain/repositories/post.repository.interface.ts': `
import { Post } from '../entities/post.entity';
export const POST_REPOSITORY = Symbol('POST_REPOSITORY');
export interface IPostRepository {
  create(post: Post): Promise<Post>;
  findAll(cursor?: string, limit?: number, businessId?: string, userId?: string): Promise<{posts: any[], nextCursor: string | null}>;
  findById(id: string): Promise<any | null>;
  update(id: string, text: string, image?: string): Promise<any>;
  delete(id: string): Promise<void>;
  toggleLike(postId: string, userId: string): Promise<boolean>;
  addComment(postId: string, userId: string, text: string): Promise<any>;
  deleteComment(commentId: string, userId: string): Promise<boolean>;
}`,
  'infrastructure/repositories/prisma-post.repository.ts': `
import { Injectable } from '@nestjs/common';
import { IPostRepository } from '../../domain/repositories/post.repository.interface';
import { PrismaService } from '../../../../shared/database/prisma.service';
import { Post } from '../../domain/entities/post.entity';

@Injectable()
export class PrismaPostRepository implements IPostRepository {
  constructor(private prisma: PrismaService) {}

  async create(post: Post): Promise<Post> {
    const created = await this.prisma.post.create({
      data: post.props,
      include: { business: { select: { name: true, username: true, logo: true, isVerified: true } } }
    });
    return new Post(created);
  }

  async findAll(cursor?: string, limit: number = 5, businessId?: string, userId?: string) {
    const where = businessId ? { businessId } : {};
    const posts = await this.prisma.post.findMany({
      where,
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      include: {
        business: { select: { id: true, name: true, username: true, logo: true, isVerified: true } },
        _count: { select: { likes: true, comments: true } },
        ...(userId ? { likes: { where: { userId } } } : {})
      }
    });

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem!.id;
    }

    const mappedPosts = posts.map((p: any) => ({
      ...p,
      isLikedByMe: userId ? p.likes?.length > 0 : false,
      likes: undefined
    }));

    return { posts: mappedPosts, nextCursor };
  }

  async findById(id: string) {
    return this.prisma.post.findUnique({ where: { id }, include: { business: true } });
  }

  async update(id: string, text: string, image?: string) {
    return this.prisma.post.update({
      where: { id },
      data: { text, ...(image !== undefined && { image }) },
      include: { business: { select: { name: true, username: true, logo: true, isVerified: true } } }
    });
  }

  async delete(id: string) {
    await this.prisma.post.delete({ where: { id } });
  }

  async toggleLike(postId: string, userId: string) {
    const existing = await this.prisma.like.findUnique({ where: { postId_userId: { postId, userId } } });
    if (existing) {
      await this.prisma.like.delete({ where: { id: existing.id } });
      return false; // unliked
    } else {
      await this.prisma.like.create({ data: { postId, userId } });
      return true; // liked
    }
  }

  async addComment(postId: string, userId: string, text: string) {
    return this.prisma.comment.create({
      data: { postId, userId, text },
      include: { user: { select: { id: true, name: true, username: true } } }
    });
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment || comment.userId !== userId) return false;
    await this.prisma.comment.delete({ where: { id: commentId } });
    return true;
  }
}
`,
  'application/use-cases/create-post.use-case.ts': `
import { Injectable, Inject } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '../../domain/repositories/post.repository.interface';
import { Post } from '../../domain/entities/post.entity';
import { PrismaService } from '../../../../shared/database/prisma.service';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private postRepo: IPostRepository,
    private prisma: PrismaService
  ) {}

  async execute(businessId: string, data: any) {
    const post = new Post({
      text: data.text,
      image: data.image || null,
      tags: data.tags || [],
      location: data.location || null,
      businessId,
    });
    return this.postRepo.create(post);
  }
}`,
  'presentation/controllers/posts.controller.ts': `
import { Controller, Post, Body, Get, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { IPostRepository, POST_REPOSITORY } from '../../domain/repositories/post.repository.interface';
import { Inject } from '@nestjs/common';
import { PrismaService } from '../../../../shared/database/prisma.service';

@Controller('v1/posts')
export class PostsController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    @Inject(POST_REPOSITORY) private postRepo: IPostRepository,
    private prisma: PrismaService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@CurrentUser() user: any, @Body() data: any) {
    const business = await this.prisma.business.findFirst({ where: { ownerId: user.id } });
    if (!business) throw new Error('Business not found');
    return this.createPostUseCase.execute(business.id, data);
  }

  @Get()
  async getPosts(@Query('cursor') cursor: string, @Query('limit') limit: string, @Query('businessId') businessId: string, @Query('userId') userId: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 5;
    return this.postRepo.findAll(cursor, parsedLimit, businessId, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePost(@CurrentUser() user: any, @Param('id') id: string) {
    const business = await this.prisma.business.findFirst({ where: { ownerId: user.id } });
    const post = await this.postRepo.findById(id);
    if (!business || post?.businessId !== business.id) throw new Error('Unauthorized');
    await this.postRepo.delete(id);
    return { success: true };
  }

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  async updatePost(@CurrentUser() user: any, @Param('id') id: string, @Body() data: any) {
    const business = await this.prisma.business.findFirst({ where: { ownerId: user.id } });
    const post = await this.postRepo.findById(id);
    if (!business || post?.businessId !== business.id) throw new Error('Unauthorized');
    return this.postRepo.update(id, data.text, data.image);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async toggleLike(@CurrentUser() user: any, @Param('id') id: string) {
    const isLiked = await this.postRepo.toggleLike(id, user.id);
    return { isLiked };
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(@CurrentUser() user: any, @Param('id') id: string, @Body('text') text: string) {
    return this.postRepo.addComment(id, user.id, text);
  }

  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@CurrentUser() user: any, @Param('id') id: string) {
    const success = await this.postRepo.deleteComment(id, user.id);
    if (!success) throw new Error('Unauthorized');
    return { success };
  }

  @Get(':id/comments')
  async getComments(@Param('id') id: string) {
    return this.prisma.comment.findMany({
      where: { postId: id },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true, username: true } } }
    });
  }
}
`,
  'posts.module.ts': `
import { Module } from '@nestjs/common';
import { PostsController } from './presentation/controllers/posts.controller';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { PrismaPostRepository } from './infrastructure/repositories/prisma-post.repository';
import { POST_REPOSITORY } from './domain/repositories/post.repository.interface';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [PostsController],
  providers: [
    CreatePostUseCase,
    { provide: POST_REPOSITORY, useClass: PrismaPostRepository }
  ],
})
export class PostsModule {}
`
};

for (const [relativePath, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(basePath, relativePath), content.trim());
}

console.log('Posts module scaffolded.');
