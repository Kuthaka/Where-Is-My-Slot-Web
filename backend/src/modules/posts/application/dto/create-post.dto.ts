import { IsString, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsString()
  image!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  location?: string;
}
