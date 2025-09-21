import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { createApiResponse } from '@/utils';

// Validation for creating drive type
export const validateDriveType = [
  body('name')
    .notEmpty()
    .withMessage('Drive type name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Drive type name must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  body('code')
    .notEmpty()
    .withMessage('Drive type code is required')
    .isLength({ min: 1, max: 10 })
    .withMessage('Drive type code must be between 1 and 10 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Code must contain only uppercase letters and numbers')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Description cannot exceed 300 characters')
    .trim()
    .escape(),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Validation for updating drive type
export const validateDriveTypeUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Drive type name must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  body('code')
    .optional()
    .isLength({ min: 1, max: 10 })
    .withMessage('Drive type code must be between 1 and 10 characters')
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Code must contain only uppercase letters and numbers')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Description cannot exceed 300 characters')
    .trim()
    .escape(),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Validation for updating drive type status
export const validateDriveTypeStatus = [
  body('active')
    .notEmpty()
    .withMessage('Active status is required')
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Validation for bulk status update
export const validateBulkStatusUpdate = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs array is required and must contain at least one ID')
    .custom((ids: string[]) => {
      if (!ids.every(id => typeof id === 'string' && id.length > 0)) {
        throw new Error('All IDs must be valid strings');
      }
      return true;
    }),
  
  body('active')
    .notEmpty()
    .withMessage('Active status is required')
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Validation for search query
export const validateSearch = [
  body('query')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
    .trim()
    .escape()
];

// Middleware to handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    const response = createApiResponse(
      false,
      'Validation failed',
      undefined,
      errorMessages.join(', ')
    );
    res.status(400).json(response);
    return;
  }
  
  next();
};
