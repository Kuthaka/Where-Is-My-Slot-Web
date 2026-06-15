import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { USER_REPOSITORY, IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, newPasswordPlain: string, oldPasswordPlain?: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isPasswordSet) {
      if (!oldPasswordPlain) {
        throw new BadRequestException('Old password is required to change password');
      }
      const isPasswordValid = await bcrypt.compare(oldPasswordPlain, user.passwordHash);
      if (!isPasswordValid) {
        throw new BadRequestException('Invalid old password');
      }
    }

    const hashed = await bcrypt.hash(newPasswordPlain, 10);
    user.passwordHash = hashed;
    user.isPasswordSet = true;
    
    await this.userRepository.update(user.id, {
      passwordHash: hashed,
      isPasswordSet: true,
    });

    return { success: true, message: 'Password updated successfully' };
  }
}
