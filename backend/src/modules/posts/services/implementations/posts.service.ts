import { IPostsService } from '../interfaces/posts.service.interface';
import { IPostRepository } from '../../repositories/interfaces/post.repository.interface';
import { Post } from '../../entities/post.entity';
import { v4 as uuidv4 } from 'uuid';

export class PostsService implements IPostsService {
  constructor(private readonly postRepository: IPostRepository) {}

  async createPost(
    businessId: string,
    data: { text: string; image?: string; tags?: string[]; location?: string }
  ): Promise<Post> {
    const post = new Post({
      id: uuidv4(),
      text: data.text,
      image: data.image ?? null,
      tags: data.tags ?? [],
      location: data.location ?? null,
      views: 0,
      businessId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.postRepository.create(post);
  }
}
