import { body } from 'express-validator';

export const validateModel = [
  body('name')
    .notEmpty()
    .withMessage('Model name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Model name must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  body('make')
    .notEmpty()
    .withMessage('Make is required')
    .isMongoId()
    .withMessage('Make must be a valid ObjectId'),
  
  body('vehicleType')
    .notEmpty()
    .withMessage('Vehicle type is required')
    .isMongoId()
    .withMessage('Vehicle type must be a valid ObjectId'),
  
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

export const validateModelUpdate = [
  body('name')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Model name must be between 1 and 50 characters')
    .trim()
    .escape(),
  
  body('make')
    .optional()
    .isMongoId()
    .withMessage('Make must be a valid ObjectId'),
  
  body('vehicleType')
    .optional()
    .isMongoId()
    .withMessage('Vehicle type must be a valid ObjectId'),
  
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
