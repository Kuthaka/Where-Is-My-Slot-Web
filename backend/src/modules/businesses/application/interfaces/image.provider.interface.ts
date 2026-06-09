export const IMAGE_PROVIDER = Symbol('IMAGE_PROVIDER');

export interface IImageProvider {
  uploadImage(fileBuffer: Buffer, folder: string): Promise<{ url: string }>;
}
