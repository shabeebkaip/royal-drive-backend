import { body } from 'express-validator';

// Validation rules for creating a new make
export const validateMake = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Make name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-&.]+$/)
    .withMessage('Make name can only contain letters, numbers, spaces, hyphens, ampersands, and periods'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('logo')
    .optional()
    .trim()
    .isURL()
    .withMessage('Logo must be a valid URL'),

  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

// Validation rules for updating a make (all fields optional)
export const validateMakeUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Make name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z0-9\s\-&.]+$/)
    .withMessage('Make name can only contain letters, numbers, spaces, hyphens, ampersands, and periods'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('logo')
    .optional()
    .trim()
    .isURL()
    .withMessage('Logo must be a valid URL'),

  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];
