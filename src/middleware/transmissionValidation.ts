import { body, param, query } from 'express-validator';

export const transmissionValidation = {
  // Create transmission validation
  create: [
    body('name')
      .notEmpty()
      .withMessage('Transmission name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Transmission name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z0-9\s\-]+$/)
      .withMessage('Transmission name can only contain letters, numbers, spaces, and hyphens')
      .trim(),
    
    body('active')
      .optional()
      .isBoolean()
      .withMessage('Active must be a boolean value')
  ],

  // Update transmission validation
  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid transmission ID'),
    
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Transmission name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z0-9\s\-]+$/)
      .withMessage('Transmission name can only contain letters, numbers, spaces, and hyphens')
      .trim(),
    
    body('active')
      .optional()
      .isBoolean()
      .withMessage('Active must be a boolean value')
  ],

  // Update status validation
  updateStatus: [
    param('id')
      .isMongoId()
      .withMessage('Invalid transmission ID'),
    
    body('active')
      .notEmpty()
      .withMessage('Active status is required')
      .isBoolean()
      .withMessage('Active must be a boolean value')
  ],

  // Get by ID validation
  getById: [
    param('id')
      .isMongoId()
      .withMessage('Invalid transmission ID')
  ],

  // Get by slug validation
  getBySlug: [
    param('slug')
      .notEmpty()
      .withMessage('Slug is required')
      .isLength({ min: 1, max: 100 })
      .withMessage('Invalid slug format')
  ],

  // Search validation
  search: [
    query('q')
      .notEmpty()
      .withMessage('Search query is required')
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters')
  ],

  // List validation
  list: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    
    query('active')
      .optional()
      .isBoolean()
      .withMessage('Active must be a boolean value'),
    
    query('sortBy')
      .optional()
      .isIn(['name', 'createdAt', 'updatedAt'])
      .withMessage('SortBy must be one of: name, createdAt, updatedAt'),
    
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('SortOrder must be either asc or desc')
  ]
};
