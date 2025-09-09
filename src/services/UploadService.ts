import type { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { cloudinary } from '@/config/cloudinary.js';
import streamifier from 'streamifier';

export type UploadResult = {
  url: string;
  secureUrl: string;
  publicId: string;
  resourceType: 'image' | 'video' | 'raw';
  format?: string;
  bytes: number;
  width?: number;
  height?: number;
  originalFilename?: string;
};

function detectResourceType(mime: string): 'image' | 'video' | 'raw' {
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  return 'raw';
}

export class UploadService {
  async uploadBuffer(
    file: Express.Multer.File,
    folder?: string,
    options: Partial<UploadApiOptions> = {}
  ): Promise<UploadResult> {
    const resource_type = detectResourceType(file.mimetype);
    const targetFolder =
      folder ||
      (resource_type === 'image'
        ? 'royal-drive/images'
        : resource_type === 'video'
        ? 'royal-drive/videos'
        : 'royal-drive/files');

    const uploadOpts: UploadApiOptions = {
      folder: targetFolder,
      resource_type,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      ...(resource_type === 'image' ? { transformation: [{ fetch_format: 'auto', quality: 'auto' }] } : {}),
      ...options,
    } as UploadApiOptions;

    return new Promise<UploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOpts, (err, result?: UploadApiResponse) => {
        if (err) return reject(err);
        if (!result) return reject(new Error('No result from Cloudinary'));
        resolve({
          url: result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type as UploadResult['resourceType'],
          format: result.format,
          bytes: result.bytes,
          width: result.width,
          height: result.height,
          originalFilename: file.originalname,
        });
      });
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}

export const uploadService = new UploadService();
