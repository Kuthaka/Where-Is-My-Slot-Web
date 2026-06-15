import { Controller, Post, Body } from '@nestjs/common';
import { SendOtpDto } from '../../application/dto/send-otp.dto';
import { VerifyOtpDto } from '../../application/dto/verify-otp.dto';
import { SendOtpUseCase } from '../../application/use-cases/send-otp.use-case';
import { VerifyOtpUseCase } from '../../application/use-cases/verify-otp.use-case';
import { LoginBusinessUseCase } from '../../application/use-cases/login-business.use-case';
import { SetPasswordUseCase } from '../../application/use-cases/set-password.use-case';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginBusinessDto } from '../../application/dto/login-business.dto';
import { SetPasswordDto } from '../../application/dto/set-password.dto';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { UseGuards, Request, Get, Inject, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt-auth.guard';
import { USER_REPOSITORY, IUserRepository } from '../../../users/domain/repositories/user.repository.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly sendOtpUseCase: SendOtpUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
    private readonly loginBusinessUseCase: LoginBusinessUseCase,
    private readonly setPasswordUseCase: SetPasswordUseCase,
    private readonly registerUserUseCase: RegisterUserUseCase,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  @Post('send-otp')
  async sendOtp(@Body() body: SendOtpDto) {
    return this.sendOtpUseCase.execute(body.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.verifyOtpUseCase.execute(body.email, body.otp);
  }

  @Post('login')
  async loginBusiness(@Body() body: LoginBusinessDto) {
    return this.loginBusinessUseCase.execute(body.email, body.password);
  }

  @Post('register')
  async registerUser(@Body() body: RegisterUserDto) {
    const name = `${body.firstName} ${body.lastName}`.trim();
    return this.registerUserUseCase.execute({
      name,
      username: body.username,
      email: body.email,
      passwordPlain: body.password,
    });
  }

  @Get('check-availability')
  async checkAvailability(@Query('username') username?: string, @Query('email') email?: string) {
    try {
      const result = { usernameAvailable: true, emailAvailable: true };
      if (username) {
        const existingUser = await this.userRepository.findByUsername(username);
        result.usernameAvailable = !existingUser;
      }
      if (email) {
        const existingEmail = await this.userRepository.findByEmail(email);
        result.emailAvailable = !existingEmail;
      }
      return result;
    } catch (error) {
      console.error("ERROR IN CHECK AVAILABILITY:", error);
      throw error;
    }
  }

  @Post('set-password')
  @UseGuards(JwtAuthGuard)
  async setPassword(@Request() req: any, @Body() body: SetPasswordDto) {
    const userId = req.user.id;
    return this.setPasswordUseCase.execute(userId, body.newPassword, body.oldPassword);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req: any) {
    const user = await this.userRepository.findById(req.user.id);
    if (!user) return null;
    // omit sensitive fields
    const { passwordHash, ...safeUser } = user as any;
    return safeUser;
  }
}
