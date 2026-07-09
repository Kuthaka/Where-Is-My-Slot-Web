import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// ─── Cloudinary Service ────────────────────────────────────────────────────────

let initialized = false;

function ensureInit(): void {
  if (initialized) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  initialized = true;
}

export async function uploadBuffer(buffer: Buffer): Promise<string> {
  ensureInit();

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
