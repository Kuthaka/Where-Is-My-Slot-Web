import { Injectable } from '@nestjs/common';
import { IImageProvider } from '../../application/interfaces/image.provider.interface';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CloudinaryImageProvider implements IImageProvider {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }
  async uploadImage(fileBuffer: Buffer, folder: string): Promise<{ url: string }> {
    const toStream = require('buffer-to-stream');
    
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result?.secure_url as string });
        },
      );
      toStream(fileBuffer).pipe(upload);
    });
  }
}
