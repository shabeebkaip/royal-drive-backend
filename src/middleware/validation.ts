import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { AppError } from '../utils/index.js';

// Basic validation schemas for starter pack
export const paginationSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).optional().default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional().default('10'),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

// Example validation schema - replace with your own
export const exampleSchema = z.object({
  body: z.object({
    name: z.string()
      .min(1, 'Name is required')
      .max(100, 'Name cannot exceed 100 characters'),
    description: z.string()
      .max(500, 'Description cannot exceed 500 characters')
      .optional(),
    isActive: z.boolean().optional().default(true),
  }),
});

// Validation middleware factory
export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Basic middleware template for future authentication
// This is kept as a template for when you need to add authentication later
export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Placeholder for future authentication logic
  // You can implement JWT, session, or any other auth strategy here
  next();
};

// Example middleware for API key validation (optional)
export const validateApiKey = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
  res.status(401).json({
      success: false,
      message: 'API key required',
      timestamp: new Date().toISOString()
    });
  return;
  }

  // Add your API key validation logic here
  // For now, we'll just pass through
  next();
};

// Vehicle validation rules
export const validateVehicle = [
  // Basic vehicle information
  body('vin')
  .optional()
  .isLength({ min: 17, max: 17 })
  .withMessage('VIN must be exactly 17 characters')
  .matches(/^[A-HJ-NPR-Z0-9]{17}$/)
  .withMessage('Invalid VIN format'),

  body('make')
    .notEmpty()
    .withMessage('Make is required')
    .isMongoId()
    .withMessage('Make must be a valid ObjectId'),

  body('model')
    .notEmpty()
    .withMessage('Model is required')
    .isMongoId()
    .withMessage('Model must be a valid ObjectId'),

  body('year')
    .isInt({ min: 1900, max: new Date().getFullYear() + 2 })
    .withMessage('Year must be between 1900 and 2 years in the future'),

  body('type')
    .notEmpty()
    .withMessage('Vehicle type is required')
    .isMongoId()
    .withMessage('Vehicle type must be a valid ObjectId'),

  // Engine validation
  body('engine.size')
    .isFloat({ min: 0.5 })
    .withMessage('Engine size must be at least 0.5L'),

  body('engine.cylinders')
    .isInt({ min: 1 })
    .withMessage('Must have at least 1 cylinder'),

  body('engine.fuelType')
    .isMongoId()
    .withMessage('Engine fuel type must be a valid ObjectId'),

  // Transmission validation
  body('transmission.type')
    .isMongoId()
    .withMessage('Transmission type must be a valid ObjectId'),

  // Drivetrain validation
  body('drivetrain')
    .isMongoId()
    .withMessage('Drivetrain must be a valid ObjectId'),

  // Odometer validation
  body('odometer.value')
    .isFloat({ min: 0 })
    .withMessage('Odometer value cannot be negative'),

  body('odometer.unit')
    .isIn(['km', 'miles'])
    .withMessage('Odometer unit must be km or miles'),

  // Condition validation
  body('condition')
    .isIn(['new', 'used', 'certified-pre-owned'])
    .withMessage('Condition must be one of: new, used, certified-pre-owned'),

  // Pricing validation
  body('pricing.listPrice')
    .isFloat({ min: 0 })
    .withMessage('List price must be a positive number'),

  // Specifications validation
  body('specifications.exteriorColor')
    .notEmpty()
    .withMessage('Exterior color is required'),

  body('specifications.interiorColor')
    .notEmpty()
    .withMessage('Interior color is required'),

  body('specifications.doors')
    .isInt({ min: 2 })
    .withMessage('Must have at least 2 doors'),

  body('specifications.seatingCapacity')
    .isInt({ min: 1 })
    .withMessage('Must seat at least 1 person'),

  // Location removed

  // Status validation
  body('status')
    .optional()
    .isMongoId()
    .withMessage('Status must be a valid ObjectId'),

  // Internal tracking validation - stock number is auto-generated, so not required
  // body('internal.stockNumber') - removed as it's auto-generated

  // Marketing validation
  body('marketing.description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  // Media validation
  body('media.images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
  throw new AppError('Validation failed: ' + errors.array().map(err => `${(err as any).param}: ${err.msg}`).join(', '), 400);
    }
    next();
  }
];

// Vehicle update validation (more lenient)
export const validateVehicleUpdate = [
  // Basic vehicle information (optional for updates)
  body('vin')
    .optional()
    .isLength({ min: 17, max: 17 })
    .withMessage('VIN must be exactly 17 characters')
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/)
    .withMessage('Invalid VIN format'),

  body('make')
    .optional()
    .isMongoId()
    .withMessage('Make must be a valid ObjectId'),

  body('model')
    .optional()
    .isMongoId()
    .withMessage('Model must be a valid ObjectId'),

  body('year')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 2 })
    .withMessage('Year must be between 1900 and 2 years in the future'),

  body('type')
    .optional()
    .isMongoId()
    .withMessage('Vehicle type must be a valid ObjectId'),

  // Engine validation (optional)
  body('engine.size')
    .optional()
    .isFloat({ min: 0.5 })
    .withMessage('Engine size must be at least 0.5L'),

  body('engine.cylinders')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Must have at least 1 cylinder'),

  body('engine.fuelType')
    .optional()
    .isMongoId()
    .withMessage('Engine fuel type must be a valid ObjectId'),

  // Transmission validation (optional)
  body('transmission.type')
    .optional()
    .isMongoId()
    .withMessage('Transmission type must be a valid ObjectId'),

  // Drivetrain validation (optional)
  body('drivetrain')
    .optional()
    .isMongoId()
    .withMessage('Drivetrain must be a valid ObjectId'),

  // Condition validation (optional)
  body('condition')
    .optional()
    .isIn(['new', 'used', 'certified-pre-owned'])
    .withMessage('Condition must be one of: new, used, certified-pre-owned'),

  // Pricing validation (optional)
  body('pricing.listPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('List price must be a positive number'),

  // Status validation (optional)
  body('status')
    .optional()
    .isMongoId()
    .withMessage('Status must be a valid ObjectId'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
  throw new AppError('Validation failed: ' + errors.array().map(err => `${(err as any).param}: ${err.msg}`).join(', '), 400);
    }
    next();
  }
];
