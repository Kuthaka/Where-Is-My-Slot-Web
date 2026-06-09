import { Controller, Post, Body } from '@nestjs/common';
import { SendOtpDto } from '../../application/dto/send-otp.dto';
import { VerifyOtpDto } from '../../application/dto/verify-otp.dto';
import { SendOtpUseCase } from '../../application/use-cases/send-otp.use-case';
import { VerifyOtpUseCase } from '../../application/use-cases/verify-otp.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly sendOtpUseCase: SendOtpUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
  ) {}

  @Post('send-otp')
  async sendOtp(@Body() body: SendOtpDto) {
    return this.sendOtpUseCase.execute(body.email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto) {
    return this.verifyOtpUseCase.execute(body.email, body.otp);
  }
}
