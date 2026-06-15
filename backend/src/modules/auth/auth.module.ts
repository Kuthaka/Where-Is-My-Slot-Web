import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './presentation/controllers/auth.controller';
import { SendOtpUseCase } from './application/use-cases/send-otp.use-case';
import { VerifyOtpUseCase } from './application/use-cases/verify-otp.use-case';
import { LoginBusinessUseCase } from './application/use-cases/login-business.use-case';
import { SignupBusinessUseCase } from './application/use-cases/signup-business.use-case';
import { SetPasswordUseCase } from './application/use-cases/set-password.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { OTP_REPOSITORY } from './domain/repositories/otp.repository.interface';
import { PrismaOtpRepository } from './infrastructure/repositories/prisma-otp.repository';
import { UsersModule } from '../users/users.module';
import { PrismaService } from '../../shared/database/prisma.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: false,
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: '"Where Is My Slot" <noreply@whereismyslot.com>',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    JwtStrategy,
    SendOtpUseCase,
    VerifyOtpUseCase,
    LoginBusinessUseCase,
    SignupBusinessUseCase,
    SetPasswordUseCase,
    RegisterUserUseCase,
    {
      provide: OTP_REPOSITORY,
      useClass: PrismaOtpRepository,
    },
  ],
  exports: [JwtModule],
})
export class AuthModule {}
