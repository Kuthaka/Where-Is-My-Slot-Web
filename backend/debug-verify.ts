import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { VerifyOtpUseCase } from './src/modules/auth/application/use-cases/verify-otp.use-case';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const verifyOtpUseCase = app.get(VerifyOtpUseCase);
  try {
    const res = await verifyOtpUseCase.execute('test4@test.com', '123456');
    console.log("SUCCESS:", res);
  } catch (e) {
    console.error("ERROR:", e);
  }
  await app.close();
}
bootstrap();
