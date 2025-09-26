import { body, param, query } from 'express-validator';

export const validateCreateEnquiry = [
  body('vehicleId')
    .notEmpty()
    .withMessage('Vehicle ID is required')
    .isMongoId()
    .withMessage('Invalid vehicle ID format'),

  body('customer.firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('customer.lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('customer.email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('customer.phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Invalid phone number format'),

  body('customer.preferredContact')
    .optional()
    .isIn(['email', 'phone', 'both'])
    .withMessage('Preferred contact must be email, phone, or both'),

  body('enquiry.type')
    .notEmpty()
    .withMessage('Enquiry type is required')
    .isIn(['general', 'financing', 'trade-in', 'test-drive', 'price-negotiation'])
    .withMessage('Invalid enquiry type'),

  body('enquiry.message')
    .notEmpty()
    .withMessage('Enquiry message is required')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),

  body('enquiry.preferredDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) {
        throw new Error('Preferred date cannot be in the past');
      }
      return true;
    }),

  body('enquiry.preferredTime')
    .optional()
    .trim()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (use HH:MM)'),

  body('interests.testDrive')
    .optional()
    .isBoolean()
    .withMessage('Test drive interest must be boolean'),

  body('interests.financing')
    .optional()
    .isBoolean()
    .withMessage('Financing interest must be boolean'),

  body('interests.tradeIn')
    .optional()
    .isBoolean()
    .withMessage('Trade-in interest must be boolean'),

  body('interests.warranty')
    .optional()
    .isBoolean()
    .withMessage('Warranty interest must be boolean'),

  body('source')
    .optional()
    .isIn(['website', 'phone', 'showroom', 'social-media', 'referral'])
    .withMessage('Invalid source')
];

export const validateUpdateEnquiry = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID'),

  body('status')
    .optional()
    .isIn(['new', 'contacted', 'in-progress', 'completed', 'closed'])
    .withMessage('Invalid status'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),

  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid assigned user ID'),

  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Admin notes cannot exceed 2000 characters')
];

export const validateGetEnquiryById = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID')
];

export const validateDeleteEnquiry = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID')
];

export const validateGetEnquiriesByVehicle = [
  param('vehicleId')
    .isMongoId()
    .withMessage('Invalid vehicle ID')
];

export const validateAssignEnquiry = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID'),

  body('assignedTo')
    .notEmpty()
    .withMessage('Assigned user ID is required')
    .isMongoId()
    .withMessage('Invalid assigned user ID')
];

export const validateAddContactHistory = [
  param('id')
    .isMongoId()
    .withMessage('Invalid enquiry ID'),

  body('method')
    .notEmpty()
    .withMessage('Contact method is required')
    .isIn(['email', 'phone', 'in-person'])
    .withMessage('Invalid contact method'),

  body('notes')
    .notEmpty()
    .withMessage('Contact notes are required')
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Contact notes must be between 5 and 1000 characters')
];

export const validateEnquiryQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .isIn(['new', 'contacted', 'in-progress', 'completed', 'closed'])
    .withMessage('Invalid status filter'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority filter'),

  query('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid assigned user ID'),

  query('vehicleId')
    .optional()
    .isMongoId()
    .withMessage('Invalid vehicle ID'),

  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for dateFrom'),

  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format for dateTo'),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters')
];
