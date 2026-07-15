import cloudinary from '../../config/cloudinary';
import { Readable } from 'stream';

// ─── Cloudinary Service ────────────────────────────────────────────────────────

export async function uploadBuffer(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'whereslot', resource_type: 'image' },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Upload failed'));
        resolve(result.secure_url);
      }
    );
    const readable = Readable.from(buffer);
    readable.pipe(stream);
  });
}
