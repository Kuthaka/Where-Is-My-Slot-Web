import { IsString, IsEmail, IsOptional, IsArray, Allow, IsInt, IsNumber } from 'class-validator';

export class OnboardBusinessDto {
  // Step 1: Initial Fields
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  pincode?: string;

  @IsString()
  @IsOptional()
  plotNo?: string;

  @IsString()
  @IsOptional()
  buildingName?: string;

  @IsString()
  @IsOptional()
  streetName?: string;

  @IsString()
  @IsOptional()
  landmark?: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  mobileNumbers?: string[];

  @IsString()
  @IsOptional()
  whatsappNumber?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  landlineNumbers?: string[];

  @IsArray()
  @IsEmail({}, { each: true })
  @IsOptional()
  emails?: string[];

  @IsEmail()
  email!: string; // Primary email

  @IsString()
  @IsOptional()
  phone?: string; // Primary phone

  @IsString()
  @IsOptional()
  address?: string; // Full Address Text

  @Allow()
  timings?: any;

  @IsString()
  @IsOptional()
  primaryCategory?: string;

  // Step 2: Full Profile Fields
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  establishedYear?: number;

  @IsString()
  @IsOptional()
  gstNumber?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  googleMapsUrl?: string;

  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @Allow()
  socialLinks?: any;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subCategories?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @Allow()
  parking?: any;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  coverPhoto?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
