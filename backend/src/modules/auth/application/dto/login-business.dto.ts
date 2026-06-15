import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginBusinessDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
