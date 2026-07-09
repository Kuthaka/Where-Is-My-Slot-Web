import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../users/domain/repositories/user.repository.interface';
import { BadRequestError, NotFoundError } from '../../../../shared/errors/app-error';

// ─── Set Password Use Case ─────────────────────────────────────────────────────

export class SetPasswordUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    userId: string,
    newPasswordPlain: string,
    oldPasswordPlain?: string
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    if (user.isPasswordSet) {
      if (!oldPasswordPlain) {
        throw new BadRequestError('Old password is required to change password');
      }
      const isValid = await bcrypt.compare(oldPasswordPlain, user.passwordHash);
      if (!isValid) throw new BadRequestError('Invalid old password');
    }

    const hashed = await bcrypt.hash(newPasswordPlain, 10);
    await this.userRepository.update(userId, { passwordHash: hashed, isPasswordSet: true });

    return { success: true, message: 'Password updated successfully' };
  }
}
