import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { USER_REPOSITORY, IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { User } from '../../../users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: { name: string; username: string; email: string; passwordPlain: string }) {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new BadRequestException('User with this email already exists');
    }

    const existingUsername = await this.userRepository.findByUsername(data.username);
    if (existingUsername) {
      throw new BadRequestException('User with this username already exists');
    }
    
    const passwordHash = await bcrypt.hash(data.passwordPlain, 10);

    const user = new User(
      uuidv4(),
      data.name,
      data.username,
      data.email,
      passwordHash,
      true, // isPasswordSet
      'USER',
      true, // isActive
      new Date(),
      new Date(),
    );

    return this.userRepository.create(user);
  }
}
