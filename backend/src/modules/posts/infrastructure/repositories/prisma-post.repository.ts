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