import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

// Configure Cloudinary either via CLOUDINARY_URL or discrete vars
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  // Provide an explicit warning to help diagnose missing credentials quickly
  console.warn('⚠️  Cloudinary is not fully configured. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET in your environment.');
}

export { cloudinary };
