import { body, param, query } from 'express-validator';

// Public create submission validation
export const validateCreateCarSubmission = [
  body('vehicle.make').notEmpty().withMessage('Make is required').isLength({ max: 50 }),
  body('vehicle.model').notEmpty().withMessage('Model is required').isLength({ max: 50 }),
  body('vehicle.year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('vehicle.mileage').isInt({ min: 0 }).withMessage('Mileage must be >= 0'),
  body('vehicle.condition').isIn(['excellent', 'good', 'fair', 'poor']).withMessage('Invalid condition'),
  body('vehicle.bodyType').isIn(['sedan', 'suv', 'coupe', 'hatchback', 'truck', 'convertible', 'wagon', 'other']).withMessage('Invalid body type'),
  body('vehicle.fuelType').isIn(['gasoline', 'diesel', 'hybrid', 'electric', 'other']).withMessage('Invalid fuel type'),
  body('vehicle.transmission').isIn(['manual', 'automatic', 'cvt']).withMessage('Invalid transmission'),
  body('vehicle.drivetrain').isIn(['fwd', 'rwd', 'awd', '4wd']).withMessage('Invalid drivetrain'),
  body('vehicle.exteriorColor').notEmpty().withMessage('Exterior color required'),
  body('vehicle.interiorColor').notEmpty().withMessage('Interior color required'),

  body('pricing.expectedPrice').isFloat({ min: 0 }).withMessage('Expected price must be >= 0'),
  body('pricing.priceFlexible').isBoolean().withMessage('priceFlexible must be boolean'),
  body('pricing.reasonForSelling').notEmpty().isLength({ max: 500 }),

  body('owner.firstName').notEmpty().isLength({ max: 50 }),
  body('owner.lastName').notEmpty().isLength({ max: 50 }),
  body('owner.email').isEmail().withMessage('Valid email required'),
  body('owner.phone').matches(/^\+?[\d\s-()]+$/).withMessage('Invalid phone'),
  body('owner.address.street').notEmpty(),
  body('owner.address.city').notEmpty(),
  body('owner.address.province').notEmpty(),
  body('owner.address.postalCode').notEmpty(),
  body('owner.preferredContact').optional().isIn(['email', 'phone', 'both']),

  body('history.previousOwners').isInt({ min: 1, max: 20 }),
  body('history.accidentHistory').isBoolean(),
  body('history.serviceHistory').isBoolean(),

  body('features').optional().isObject(),
  body('images').optional().isArray(),
  body('source').optional().isIn(['website', 'phone', 'referral', 'walk-in', 'social-media'])
];

// Generic update validation (controller splits specifics via payload shape)
export const validateUpdateCarSubmission = [
  param('id').isMongoId().withMessage('Invalid submission ID'),
  body('status').optional().isIn(['new', 'reviewing', 'contacted', 'scheduled-inspection', 'inspected', 'offer-made', 'negotiating', 'accepted', 'rejected', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('assignedTo').optional().isMongoId(),
  body('adminNotes').optional().isLength({ max: 2000 }),
  body('evaluation').optional().isObject(),
  body('evaluation.estimatedValue').optional().isFloat({ min: 0 }),
  body('evaluation.marketValue').optional().isFloat({ min: 0 }),
  body('inspection').optional().isObject(),
  body('inspection.scheduledDate').optional().isISO8601(),
  body('inspection.completedDate').optional().isISO8601(),
  body('offer').optional().isObject(),
  body('offer.amount').optional().isFloat({ min: 0 }),
  body('offer.validUntil').optional().isISO8601(),
  body('offer.status').optional().isIn(['pending', 'accepted', 'rejected', 'counter-offered'])
];

export const validateAssignCarSubmission = [
  param('id').isMongoId(),
  body('assignedTo').notEmpty().isMongoId().withMessage('Valid assignedTo required')
];

export const validateAddContactHistoryCarSubmission = [
  param('id').isMongoId(),
  body('method').notEmpty().isIn(['email', 'phone', 'in-person']),
  body('notes').notEmpty().isLength({ min: 5, max: 1000 })
];

export const validateCarSubmissionQuery = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['new', 'reviewing', 'contacted', 'scheduled-inspection', 'inspected', 'offer-made', 'negotiating', 'accepted', 'rejected', 'completed']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('assignedTo').optional().isMongoId(),
  query('make').optional().isString(),
  query('model').optional().isString(),
  query('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('condition').optional().isIn(['excellent', 'good', 'fair', 'poor']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  query('search').optional().isLength({ min: 2, max: 100 })
];
