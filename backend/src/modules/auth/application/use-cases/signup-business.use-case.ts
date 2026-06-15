import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { USER_REPOSITORY, IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { User } from '../../../users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SignupBusinessUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: { name: string; email: string; passwordPlain: string }) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new BadRequestException('User with this email already exists');
    }
    
    const passwordHash = await bcrypt.hash(data.passwordPlain, 10);

    const user = new User(
      uuidv4(),
      data.name,
      data.email,
      passwordHash,
      true,
      'BUSINESS',
      true,
      new Date(),
      new Date(),
    );

    return this.userRepository.create(user);
  }
}
