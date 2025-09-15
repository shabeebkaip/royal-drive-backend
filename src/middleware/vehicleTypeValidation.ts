import { body } from 'express-validator';

export const validateVehicleType = [
  body('name')
    .notEmpty()
    .withMessage('Vehicle type name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Vehicle type name must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  body('icon')
    .optional()
    .isURL()
    .withMessage('Icon must be a valid URL'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim()
    .escape(),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];

export const validateVehicleTypeUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Vehicle type name must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  body('icon')
    .optional()
    .isURL()
    .withMessage('Icon must be a valid URL'),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim()
    .escape(),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean value')
];
