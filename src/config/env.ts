import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1000).max(65535)).default('3000'),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long for security'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5174,http://localhost:5175'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  // Database connection retry config
  DB_CONNECT_MAX_RETRIES: z.string().transform(Number).default('30'),
  DB_CONNECT_RETRY_MS: z.string().transform(Number).default('5000'),
  // Cloudinary
  CLOUDARY_DUMMY: z.string().optional().transform(() => ''), // placeholder to keep shape stable
  CLOUDINARY_URL: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

// Validate and export environment variables
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parseResult.error.flatten().fieldErrors);

  // Special warning for weak JWT secret
  const jwtSecretError = parseResult.error.flatten().fieldErrors.JWT_SECRET;
  if (jwtSecretError) {
    console.error('');
    console.error('🔐 JWT_SECRET Security Tips:');
    console.error('1. Generate a secure secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"');
    console.error('2. Use different secrets for dev/staging/production');
    console.error('3. Never commit secrets to version control');
    console.error('');
  }

  process.exit(1);
}

export const env = parseResult.data;

// Helper to check if we're in production
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
