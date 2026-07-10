import { IPostRepository } from '../interfaces/post.repository.interface';
import { Post, PostProps } from '../../entities/post.entity';
import { PostModel, LikeModel, CommentModel, IPostDocument } from '../../../../models/post.model';

// ─── Mongoose Post Repository ──────────────────────────────────────────────────

export class MongoosePostRepository implements IPostRepository {
  async create(postEntity: Post): Promise<Post> {
    const created = await PostModel.create({
      businessId: postEntity.props.businessId,
      text: postEntity.props.text,
      image: postEntity.props.image,
      tags: postEntity.props.tags ?? [],
      location: postEntity.props.location,
      views: postEntity.props.views ?? 0,
    });
    return this.toDomain(created);
  }

  async findById(id: string): Promise<Post | null> {
    const doc = await PostModel.findById(id).exec();
    return doc ? this.toDomain(doc) : null;
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

        const domainPost = this.toDomain(p);
        const businessObj = (p.businessId as any) || {};

        return {
          ...domainPost.props,
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

  async update(id: string, text?: string, image?: string): Promise<Post> {
    const updateData: Record<string, unknown> = {};
    if (text !== undefined) updateData.text = text;
    if (image !== undefined) updateData.image = image;

    const updated = await PostModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).exec();

    if (!updated) throw new Error('Post not found');
    return this.toDomain(updated);
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

  private toDomain(doc: IPostDocument): Post {
    const props: PostProps = {
      id: doc._id.toString(),
      text: doc.text,
      image: doc.image ?? null,
      tags: doc.tags ?? [],
      location: doc.location ?? null,
      views: doc.views ?? 0,
      businessId: (doc.businessId as any)._id
        ? (doc.businessId as any)._id.toString()
        : doc.businessId.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
    return new Post(props);
  }
}
