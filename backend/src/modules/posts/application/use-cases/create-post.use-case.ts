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
}