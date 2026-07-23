import { IPostDocument } from '../../models/post.model';
import { PostDto } from '../../dtos/business/post.dto';

export class PostMapper {
  static toDto(doc: IPostDocument): PostDto {
    return {
      id: doc._id.toString(),
      text: doc.text,
      image: doc.image,
      tags: doc.tags || [],
      location: doc.location,
      views: doc.views || 0,
      businessId: doc.businessId.toString(),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
