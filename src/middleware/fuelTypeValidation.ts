import { body, param, query } from 'express-validator';

// Validation for creating a new fuel type
export const validateCreateFuelType = [
  body('name')
    .notEmpty()
    .withMessage('Fuel type name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Fuel type name must be between 2 and 50 characters')
    .trim()
    .matches(/^[a-zA-Z0-9\s\-]+$/)
    .withMessage('Fuel type name can only contain letters, numbers, spaces, and hyphens'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Validation for updating a fuel type
export const validateUpdateFuelType = [
  param('id')
    .isMongoId()
    .withMessage('Invalid fuel type ID'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Fuel type name must be between 2 and 50 characters')
    .trim()
    .matches(/^[a-zA-Z0-9\s\-]+$/)
    .withMessage('Fuel type name can only contain letters, numbers, spaces, and hyphens'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Validation for updating fuel type status
export const validateUpdateFuelTypeStatus = [
  param('id')
    .isMongoId()
    .withMessage('Invalid fuel type ID'),
  
  body('active')
    .notEmpty()
    .withMessage('Active status is required')
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Validation for getting fuel type by ID
export const validateGetFuelTypeById = [
  param('id')
    .isMongoId()
    .withMessage('Invalid fuel type ID')
];

// Validation for getting fuel type by slug
export const validateGetFuelTypeBySlug = [
  param('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Slug must be between 2 and 50 characters')
    .matches(/^[a-z0-9\-]+$/)
    .withMessage('Slug can only contain lowercase letters, numbers, and hyphens')
];

// Validation for search
export const validateSearchFuelTypes = [
  query('q')
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Search query must be between 2 and 50 characters')
    .trim()
];

// Validation for listing fuel types
export const validateListFuelTypes = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Search must be between 2 and 50 characters')
    .trim(),
  
  query('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'createdAt', 'updatedAt'])
    .withMessage('Sort by must be one of: name, createdAt, updatedAt'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be either asc or desc')
];
