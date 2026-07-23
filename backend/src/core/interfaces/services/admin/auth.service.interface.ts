import { UserDto } from '../../../../dtos/user/user.dto';

export interface IAdminAuthService {
  login(data: Record<string, unknown>): Promise<{ admin: Partial<UserDto>; accessToken: string }>;
}
