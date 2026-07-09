import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { UnauthorizedError } from '../../../../shared/errors/app-error';
import { User } from '../../../users/domain/entities/user.entity';

// ─── Login Use Case ────────────────────────────────────────────────────────────

export class LoginUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    email: string,
    password: string
  ): Promise<{ accessToken: string; user: Omit<User, 'passwordHash'> }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) throw new UnauthorizedError('Invalid credentials');

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, secret, { expiresIn: '7d' });

    const { passwordHash, ...safeUser } = user;
    return { accessToken, user: safeUser as Omit<User, 'passwordHash'> };
  }
}
