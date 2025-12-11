import { Router } from 'express';
import { body } from 'express-validator';
import { UserController } from '../controllers/UserController.js';
import { authenticate, requireAdmin, requireSuperAdmin } from '../middleware/auth.js';

const router: Router = Router();

// Public routes
router.post('/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
  ],
  UserController.login
);

// Protected routes (require authentication)
router.get('/profile', authenticate, UserController.getProfile);

// Admin routes (require admin role)
router.get('/users', authenticate, requireAdmin, UserController.getAllUsers);

router.post('/users',
  authenticate,
  requireSuperAdmin,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('role')
      .isIn(['superAdmin', 'admin', 'manager', 'salesperson'])
      .withMessage('Invalid role specified'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Last name cannot exceed 50 characters')
  ],
  UserController.createUser
);

router.patch('/users/:id/status',
  authenticate,
  requireAdmin,
  [
    body('status')
      .isIn(['active', 'inactive', 'suspended'])
      .withMessage('Invalid status. Must be active, inactive, or suspended')
  ],
  UserController.updateUserStatus
);

export { router as authRoutes };
