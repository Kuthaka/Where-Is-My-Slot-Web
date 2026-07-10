import { Post } from '../../entities/post.entity';

export interface IPostsService {
  createPost(
    businessId: string,
    data: { text: string; image?: string; tags?: string[]; location?: string }
  ): Promise<Post>;
}
