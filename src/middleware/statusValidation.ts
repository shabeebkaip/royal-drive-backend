import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { createApiResponse } from '../utils/index.js';

// Validation for creating status
export const validateStatus = [
  body('name')
    .notEmpty()
    .withMessage('Status name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Status name must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Description cannot exceed 300 characters')
    .trim()
    .escape(),
  
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color code (e.g., #28a745)'),
  
  body('icon')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Icon cannot exceed 100 characters')
    .trim(),
  
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('IsDefault must be a boolean value'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Validation for updating status
export const validateStatusUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Status name must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Description cannot exceed 300 characters')
    .trim()
    .escape(),
  
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Color must be a valid hex color code (e.g., #28a745)'),
  
  body('icon')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Icon cannot exceed 100 characters')
    .trim(),
  
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('IsDefault must be a boolean value'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Validation for updating status active state
export const validateStatusStatus = [
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
