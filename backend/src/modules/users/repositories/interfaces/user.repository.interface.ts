import { UserDto } from '../../dtos/user.dto';

// ─── User Repository Interface ─────────────────────────────────────────────────

export interface IUserRepository {
  findById(id: string): Promise<UserDto | null>;
  findByEmail(email: string): Promise<UserDto | null>;
  findByUsername(username: string): Promise<UserDto | null>;
  create(user: Partial<UserDto>): Promise<UserDto>;
  update(id: string, data: Partial<UserDto>): Promise<UserDto>;
}
