import { Controller, Post, Body, Get, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { IPostRepository, POST_REPOSITORY } from '../../domain/repositories/post.repository.interface';
import { Inject } from '@nestjs/common';
import { PrismaService } from '../../../../shared/database/prisma.service';
import { CreatePostDto } from '../../application/dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    @Inject(POST_REPOSITORY) private postRepo: IPostRepository,
    private prisma: PrismaService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@CurrentUser() user: any, @Body() data: CreatePostDto) {
    const business = await this.prisma.business.findFirst({ where: { ownerId: user.id } });
    if (!business) throw new Error('Business not found');
    const postEntity = await this.createPostUseCase.execute(business.id, data);
    return postEntity.props || postEntity;
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
    return this.postRepo.getComments(id);
  }
}