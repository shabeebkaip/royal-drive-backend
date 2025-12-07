import jwt from 'jsonwebtoken';
import { env } from '../config/env';


// Basic JWT utilities for future use
export class JwtUtils {
  static generateToken(payload: object): string {
    return jwt.sign(payload, env.JWT_SECRET as unknown as jwt.Secret, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    } as jwt.SignOptions);
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, env.JWT_SECRET as unknown as jwt.Secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static extractTokenFromHeader(authHeader: string | undefined): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }
    return authHeader.substring(7);
  }
}

// Common error classes
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

// Helper function to create API responses
export const createApiResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
  error?: string
): ApiResponse<T> => {
  const base = {
    success,
    message,
    timestamp: new Date().toISOString(),
  } as Omit<ApiResponse<T>, 'data' | 'error'>;

  const response: Partial<ApiResponse<T>> = { ...base };
  if (data !== undefined) response.data = data;
  if (error !== undefined) response.error = error;
  return response as ApiResponse<T>;
};

// Export port utilities
export { getAvailablePort, findAvailablePort, isPortAvailable } from './portUtils';
