import { IsString, IsEmail, IsOptional, IsArray, Allow } from 'class-validator';

export class OnboardBusinessDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  address!: string;

  @Allow()
  timings?: any;

  @Allow()
  parking?: any;

  @IsArray()
  @IsString({ each: true })
  images!: string[];
}
