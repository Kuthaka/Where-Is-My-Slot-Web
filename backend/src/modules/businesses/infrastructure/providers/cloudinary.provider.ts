import { Injectable, Inject } from '@nestjs/common';
import { IImageProvider } from '../../application/interfaces/image.provider.interface';

@Injectable()
export class CloudinaryImageProvider implements IImageProvider {
  constructor(@Inject('Cloudinary') private cloudinary: any) {}
  async uploadImage(fileBuffer: Buffer, folder: string): Promise<{ url: string }> {
    const toStream = require('buffer-to-stream');
    
    return new Promise((resolve, reject) => {
      const upload = this.cloudinary.uploader.upload_stream(
        { folder },
        (error: any, result: any) => {
          if (error) return reject(error);
          resolve({ url: result?.secure_url as string });
        },
      );
      toStream(fileBuffer).pipe(upload);
    });
  }
}
