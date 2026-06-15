import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SetPasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword!: string;

  @IsString()
  @IsOptional()
  oldPassword?: string;
}
