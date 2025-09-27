import { body } from 'express-validator';

export const createSalesValidation = [
  body('vehicle').isMongoId().withMessage('vehicle is required'),
  body('customerName').isString().trim().notEmpty().isLength({ max: 120 }),
  body('customerEmail').optional().isEmail().withMessage('Invalid email'),
  body('salePrice').isFloat({ min: 0 }).withMessage('salePrice must be >= 0'),
  body('currency').optional().isIn(['CAD','USD']),
  body('costOfGoods').optional().isFloat({ min: 0 }),
  body('discount').optional().isFloat({ min: 0 }),
  body('taxRate').optional().isFloat({ min: 0, max: 1 }),
  body('paymentMethod').optional().isIn(['cash','finance','lease']),
  body('status').optional().isIn(['pending','completed','cancelled'])
];

export const updateSalesValidation = [
  body('customerName').optional().isString().trim().isLength({ max: 120 }),
  body('customerEmail').optional().isEmail(),
  body('salePrice').optional().isFloat({ min: 0 }),
  body('costOfGoods').optional().isFloat({ min: 0 }),
  body('discount').optional().isFloat({ min: 0 }),
  body('taxRate').optional().isFloat({ min: 0, max: 1 }),
  body('paymentMethod').optional().isIn(['cash','finance','lease']),
  body('status').optional().isIn(['pending','completed','cancelled'])
];
