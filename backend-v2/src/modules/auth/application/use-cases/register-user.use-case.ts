import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { User } from '../../../users/domain/entities/user.entity';
import { BadRequestError, ConflictError } from '../../../../shared/errors/app-error';
import { v4 as uuidv4 } from 'uuid';

// ─── Register User Use Case ────────────────────────────────────────────────────

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: {
    name: string;
    username: string;
    email: string;
    passwordPlain: string;
  }): Promise<User> {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) throw new ConflictError('User with this email already exists');

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) throw new ConflictError('User with this username already exists');

    const passwordHash = await bcrypt.hash(data.passwordPlain, 10);

    const user = new User(
      uuidv4(),
      data.name,
      data.username,
      data.email,
      passwordHash,
      true,
      'USER',
      true,
      new Date(),
      new Date()
    );

    return this.userRepository.create(user);
  }
}
