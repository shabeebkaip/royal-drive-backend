import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/index';
import { env, isDevelopment } from '../config/env';
import { ZodError } from 'zod';
import { ValidationError } from 'express-validator';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = undefined;

  // Handle known application errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // Handle Zod validation errors
  else if (error instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    details = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
  }
  // Handle Mongoose validation errors
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    const mongooseError = error as any;
    details = Object.values(mongooseError.errors).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
  }
  // Handle MongoDB duplicate key errors
  else if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate entry';
    const duplicateError = error as any;
    const field = Object.keys(duplicateError.keyPattern)[0];
    details = `${field} already exists`;
  }
  // Handle JWT errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Log error in development
  if (isDevelopment) {
    console.error('❌ Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    ...(isDevelopment && { stack: error.stack }),
    timestamp: new Date().toISOString(),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
