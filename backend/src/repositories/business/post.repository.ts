import { IPostRepository } from '../../core/interfaces/repositories/business/post.repository.interface';
import { PostDto } from '../../dtos/business/post.dto';
import { PostMapper } from '../../mappers/business/post.mapper';
import { PostModel, LikeModel, CommentModel, IPostDocument } from '../../models/post.model';
import { injectable } from 'inversify';

@injectable()
export class MongoosePostRepository implements IPostRepository {
  async create(post: Partial<PostDto>): Promise<PostDto> {
    const created = await PostModel.create({
      businessId: post.businessId,
      text: post.text,
      image: post.image,
      tags: post.tags ?? [],
      location: post.location,
      views: post.views ?? 0,
    });
    return PostMapper.toDto(created);
  }

  async findById(id: string): Promise<PostDto | null> {
    const doc = await PostModel.findById(id).exec();
    return doc ? PostMapper.toDto(doc) : null;
  }

  async findAll(
    cursor?: string,
    limit: number = 5,
    businessId?: string,
    userId?: string
  ): Promise<{ posts: unknown[]; nextCursor: string | null }> {
    const query: Record<string, unknown> = {};
    if (businessId) query.businessId = businessId;
    if (cursor) query._id = { $lt: cursor };

    const posts = await PostModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate('businessId', 'name username logo isVerified')
      .exec();

    let nextCursor: string | null = null;
    if (posts.length > limit) {
      nextCursor = posts[limit - 1]._id.toString();
      posts.pop();
    }

    const formattedPosts = await Promise.all(
      posts.map(async (p: any) => {
        const postIdString = p._id.toString();
        const likeCount = await LikeModel.countDocuments({ postId: postIdString });
        const commentCount = await CommentModel.countDocuments({ postId: postIdString });
        let isLiked = false;
        if (userId) {
          const like = await LikeModel.findOne({ postId: postIdString, userId });
          if (like) isLiked = true;
        }

        const domainPost = PostMapper.toDto(p);
        const businessObj = (p.businessId as any) || {};

        return {
          ...domainPost,
          _count: { likes: likeCount, comments: commentCount },
          isLikedByMe: isLiked,
          business: {
            id: businessObj._id?.toString() || businessObj.toString(),
            name: businessObj.name,
            username: businessObj.username,
            logo: businessObj.logo,
            isVerified: businessObj.isVerified,
          },
        };
      })
    );

    return { posts: formattedPosts, nextCursor };
  }

  async update(id: string, text?: string, image?: string): Promise<PostDto> {
    const updateData: Record<string, unknown> = {};
    if (text !== undefined) updateData.text = text;
    if (image !== undefined) updateData.image = image;

    const updated = await PostModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).exec();

    if (!updated) throw new Error('Post not found');
    return PostMapper.toDto(updated);
  }

  async delete(id: string): Promise<void> {
    await PostModel.findByIdAndDelete(id).exec();
    await LikeModel.deleteMany({ postId: id }).exec();
    await CommentModel.deleteMany({ postId: id }).exec();
  }

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    const existing = await LikeModel.findOne({ postId, userId });
    if (existing) {
      await LikeModel.findByIdAndDelete(existing._id);
      return false;
    }
    await LikeModel.create({ postId, userId });
    return true;
  }

  async addComment(postId: string, userId: string, text: string): Promise<unknown> {
    return CommentModel.create({ postId, userId, text });
  }

  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const deleted = await CommentModel.findOneAndDelete({ _id: commentId, userId });
    return !!deleted;
  }

  async getComments(postId: string): Promise<unknown[]> {
    return CommentModel.find({ postId }).sort({ createdAt: -1 }).exec();
  }

  async getFlashDeals(businessId?: string): Promise<unknown[]> {
    const { Types } = require('mongoose');
    const { FlashDealModel } = require('../../../../models/misc.model');
    const { BusinessModel } = require('../../../../models/business.model');

    const where: Record<string, unknown> = { activeUntil: { $gt: new Date() } };
    if (businessId) where.businessId = new Types.ObjectId(businessId);

    const deals = await FlashDealModel.find(where).sort({ createdAt: -1 }).exec();

    return Promise.all(
      deals.map(async (deal: any) => {
        const business = await BusinessModel.findById(deal.businessId).exec();
        return {
          ...deal.toObject(),
          business: business
            ? {
                id: business._id,
                name: business.name,
                logo: business.logo,
                isVerified: business.isVerified,
                username: business.username,
              }
            : null,
        };
      })
    );
  }

  async createFlashDeal(businessId: string, offer: string, image: string, type: string, navigateLink?: string): Promise<unknown> {
    const { FlashDealModel } = require('../../../../models/misc.model');
    return FlashDealModel.create({
      businessId,
      offer,
      image,
      type,
      navigateLink,
      activeUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    });
  }
}
