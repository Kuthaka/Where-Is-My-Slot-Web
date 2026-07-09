import { Injectable, Inject, Optional } from '@nestjs/common';
import { IPostRepository, POST_REPOSITORY } from '../../domain/repositories/post.repository.interface';
import { Post } from '../../domain/entities/post.entity';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(POST_REPOSITORY) private postRepo: IPostRepository,
    @Optional() @Inject('Cloudinary') private cloudinary: any
  ) {}

  async execute(businessId: string, data: any) {
    let imageUrl = null;

    if (data.image) {
      if (data.image.startsWith('http')) {
        imageUrl = data.image; // Already a URL
      } else {
        // Base64 upload
        if (this.cloudinary) {
          const uploadResponse = await this.cloudinary.uploader.upload(data.image, {
            folder: 'posts',
          });
          imageUrl = uploadResponse.secure_url;
        }
      }
    }

    const post = new Post({
      text: data.text || '',
      image: imageUrl,
      tags: data.tags || [],
      location: data.location || null,
      businessId,
    });
    return this.postRepo.create(post);
  }
}