import { body, param, query } from 'express-validator';

/**
 * Validation for creating a new contact enquiry (Public endpoint)
 */
export const validateCreateContactEnquiry = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('First name can only contain letters, spaces, hyphens, and apostrophes'),

  body('lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Last name can only contain letters, spaces, hyphens, and apostrophes'),

  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Invalid phone number format')
    .isLength({ min: 10, max: 20 })
    .withMessage('Phone number must be between 10 and 20 characters'),

  body('subject')
    .notEmpty()
    .withMessage('Subject is required')
    .isIn(['General Inquiry', 'Vehicle Information', 'Financing Question', 'Trade-in Valuation', 'Service Question'])
    .withMessage('Invalid subject type'),

  body('message')
    .notEmpty()
    .withMessage('Message is required')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),

  body('source')
    .optional()
    .isIn(['website', 'phone', 'email', 'social-media', 'referral'])
    .withMessage('Invalid source type')
];

/**
 * Validation for updating contact enquiry (Admin only)
 */
export const validateUpdateContactEnquiry = [
  param('id')
    .notEmpty()
    .withMessage('Enquiry ID is required')
    .isMongoId()
    .withMessage('Invalid enquiry ID format'),

  body('status')
    .optional()
    .isIn(['new', 'contacted', 'in-progress', 'resolved', 'closed'])
    .withMessage('Invalid status value'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority value'),

  body('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID format'),

  body('notes.content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Note must be between 1 and 1000 characters'),

  body('contactHistory.method')
    .optional()
    .isIn(['email', 'phone', 'in-person'])
    .withMessage('Invalid contact method'),

  body('contactHistory.notes')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Contact notes must be between 1 and 1000 characters')
];

/**
 * Validation for getting enquiry by ID
 */
export const validateEnquiryId = [
  param('id')
    .notEmpty()
    .withMessage('Enquiry ID is required')
    .isMongoId()
    .withMessage('Invalid enquiry ID format')
];

/**
 * Validation for getting enquiries with query parameters (Admin only)
 */
export const validateGetEnquiries = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

  query('status')
    .optional()
    .isIn(['new', 'contacted', 'in-progress', 'resolved', 'closed'])
    .withMessage('Invalid status value'),

  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority value'),

  query('subject')
    .optional()
    .isIn(['General Inquiry', 'Vehicle Information', 'Financing Question', 'Trade-in Valuation', 'Service Question'])
    .withMessage('Invalid subject value'),

  query('assignedTo')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID format'),

  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'status', 'priority', 'firstName', 'lastName'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),

  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format')
];

/**
 * Validation for assigning enquiry to admin
 */
export const validateAssignEnquiry = [
  param('id')
    .notEmpty()
    .withMessage('Enquiry ID is required')
    .isMongoId()
    .withMessage('Invalid enquiry ID format'),

  body('adminUserId')
    .notEmpty()
    .withMessage('Admin user ID is required')
    .isMongoId()
    .withMessage('Invalid user ID format')
];

/**
 * Validation for adding note to enquiry
 */
export const validateAddNote = [
  param('id')
    .notEmpty()
    .withMessage('Enquiry ID is required')
    .isMongoId()
    .withMessage('Invalid enquiry ID format'),

  body('content')
    .notEmpty()
    .withMessage('Note content is required')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Note must be between 1 and 1000 characters')
];
