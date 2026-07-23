import { IAdminAuthService } from '../../core/interfaces/services/admin/auth.service.interface';
import { IUserRepository } from '../../core/interfaces/repositories/user/user.repository.interface';
import { BadRequestError, UnauthorizedError } from '../../shared/errors/app-error';
import { UserRole } from '../../shared/enums/user-role.enum';
import { UserDto } from '../../dtos/user/user.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { injectable, inject } from 'inversify';
import { TYPES } from '../../core/container/types';

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject(TYPES.UserRepository) private readonly userRepository: IUserRepository
  ) {}

  async login(data: Record<string, unknown>): Promise<{ admin: Partial<UserDto>; accessToken: string }> {
    const email = data.email as string;
    const password = data.password as string;

    if (!email || !password) throw new BadRequestError('Email and password are required');

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('No account found with this email');
    
    if (user.role !== UserRole.SUPER_ADMIN && user.role !== 'ADMIN') {
      throw new UnauthorizedError('This account does not have admin privileges.');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash || "");
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, type: 'admin' },
      secret,
      { expiresIn: '7d' }
    );

    const { passwordHash, ...adminProps } = user;
    return { admin: adminProps, accessToken };
  }
}
