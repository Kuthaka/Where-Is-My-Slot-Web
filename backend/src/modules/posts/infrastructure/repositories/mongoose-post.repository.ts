import { Injectable } from '@nestjs/common';
import { IPostRepository } from '../../domain/repositories/post.repository.interface';
import { Post as PostEntity } from '../../domain/entities/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../../../../models/post.schema';
import { Like } from '../../../../models/like.schema';
import { Comment } from '../../../../models/comment.schema';

@Injectable()
export class MongoosePostRepository implements IPostRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
  ) {}

  async create(postEntity: PostEntity): Promise<PostEntity> {
    const created = await this.postModel.create({
      businessId: postEntity.props.businessId,
      text: postEntity.props.text,
      image: postEntity.props.image,
      tags: postEntity.props.tags || [],
      location: postEntity.props.location,
      views: postEntity.props.views || 0
    });
    return this.mapToDomain(created);
  }

  async findById(id: string): Promise<PostEntity | null> {
    const post = await this.postModel.findById(id).exec();
    if (!post) return null;
    return this.mapToDomain(post);
  }

  async findAll(cursor?: string, limit: number = 5, businessId?: string, userId?: string): Promise<any> {
    const query: any = {};
    if (businessId) query.businessId = businessId;
    if (cursor) query._id = { $lt: cursor };

    const posts = await this.postModel.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate('businessId', 'name username logo isVerified')
      .exec();
    
    let nextCursor = null;
    if (posts.length > limit) {
      nextCursor = posts[limit - 1]._id.toString();
      posts.pop();
    }

    const formattedPosts = await Promise.all(posts.map(async (p) => {
      const postIdString = p._id.toString();
      const likeCount = await this.likeModel.countDocuments({ postId: postIdString });
      const commentCount = await this.commentModel.countDocuments({ postId: postIdString });
      let isLiked = false;
      if (userId) {
        const like = await this.likeModel.findOne({ postId: postIdString, userId });
        if (like) isLiked = true;
      }

      const domainPost = this.mapToDomain(p);
      const businessObj = (p.businessId as any) || {};
      
      return {
        ...domainPost.props,
        _count: {
          likes: likeCount,
          comments: commentCount
        },
        isLikedByMe: isLiked,
        business: {
          id: businessObj._id?.toString() || businessObj.toString(),
          name: businessObj.name,
          username: businessObj.username,
          logo: businessObj.logo,
          isVerified: businessObj.isVerified
        }
      };
    }));

    return { posts: formattedPosts, nextCursor };
  }

  async update(id: string, text?: string, image?: string): Promise<PostEntity> {
    const updateData: any = {};
    if (text !== undefined) updateData.text = text;
    if (image !== undefined) updateData.image = image;

    const updated = await this.postModel.findByIdAndUpdate(id, { $set: updateData }, { new: true }).exec();
    if (!updated) throw new Error('Post not found');
    return this.mapToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.postModel.findByIdAndDelete(id).exec();
    await this.likeModel.deleteMany({ postId: id }).exec();
    await this.commentModel.deleteMany({ postId: id }).exec();
  }

  async toggleLike(postId: string, userId: string): Promise<boolean> {
    const existingLike = await this.likeModel.findOne({ postId, userId });
    if (existingLike) {
      await this.likeModel.findByIdAndDelete(existingLike._id);
      return false;
    } else {
      await this.likeModel.create({ postId, userId });
      return true;
    }
  }

  async addComment(postId: string, userId: string, text: string): Promise<any> {
    const comment = await this.commentModel.create({
      postId,
      userId,
      text
    });
    return comment;
  }

  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const comment = await this.commentModel.findOneAndDelete({ _id: commentId, userId });
    return !!comment;
  }

  async getComments(postId: string): Promise<any[]> {
    return this.commentModel.find({ postId }).sort({ createdAt: -1 }).exec();
  }

  private mapToDomain(mongoosePost: any): PostEntity {
    return new PostEntity({
      id: mongoosePost._id.toString(),
      text: mongoosePost.text,
      image: mongoosePost.image || null,
      tags: mongoosePost.tags || [],
      location: mongoosePost.location || null,
      views: mongoosePost.views || 0,
      businessId: mongoosePost.businessId._id ? mongoosePost.businessId._id.toString() : mongoosePost.businessId.toString(),
      createdAt: mongoosePost.createdAt,
      updatedAt: mongoosePost.updatedAt,
    });
  }
}
