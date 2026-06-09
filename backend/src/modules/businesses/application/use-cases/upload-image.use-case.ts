import { Injectable, Inject } from '@nestjs/common';
import { IImageProvider, IMAGE_PROVIDER } from '../interfaces/image.provider.interface';

@Injectable()
export class UploadImageUseCase {
  constructor(
    @Inject(IMAGE_PROVIDER)
    private readonly imageProvider: IImageProvider,
  ) {}

  async execute(fileBuffer: Buffer) {
    return this.imageProvider.uploadImage(fileBuffer, 'whereismyslot/businesses');
  }
}
