import { IUserDocument } from '../../models/user.model';
import { UserDto } from '../../dtos/user/user.dto';

export class UserMapper {
  static toDto(doc: IUserDocument): UserDto {
    return {
      id: doc._id.toString(),
      name: doc.name,
      username: doc.username ?? null,
      email: doc.email,
      role: doc.role,
      isActive: doc.isActive,
      isPasswordSet: doc.isPasswordSet,
      passwordHash: doc.password ?? undefined,
      location: doc.location,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
