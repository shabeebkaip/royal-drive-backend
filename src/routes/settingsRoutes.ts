import { Router } from 'express';
import { SettingsController } from '../controllers/SettingsController';
import { authenticate, requireRole } from '../middleware/auth';
import {
  validateUpdateSettings,
  validateUpdateSocialMedia,
  validateUpdateAddress
} from '../middleware/settingsValidation';

const router: Router = Router();

// Public routes (no authentication required)
/**
 * @route   GET /api/v1/settings/public
 * @desc    Get public business settings for website display
 * @access  Public
 */
router.get('/public', SettingsController.getPublicSettings);

// Admin routes (authentication and authorization required)
/**
 * @route   GET /api/v1/settings
 * @desc    Get all business settings (admin view)
 * @access  Admin only
 */
router.get('/', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  SettingsController.getSettings
);

/**
 * @route   PUT /api/v1/settings
 * @desc    Update business settings
 * @access  Admin only
 */
router.put('/', 
  authenticate, 
  requireRole('superAdmin', 'admin'),
  validateUpdateSettings,
  SettingsController.updateSettings
);

/**
 * @route   PUT /api/v1/settings/social-media
 * @desc    Update social media links
 * @access  Admin only
 */
router.put('/social-media', 
  authenticate, 
  requireRole('superAdmin', 'admin'),
  validateUpdateSocialMedia,
  SettingsController.updateSocialMedia
);

/**
 * @route   PUT /api/v1/settings/address
 * @desc    Update business address
 * @access  Admin only
 */
router.put('/address', 
  authenticate, 
  requireRole('superAdmin', 'admin'),
  validateUpdateAddress,
  SettingsController.updateAddress
);

/**
 * @route   PUT /api/v1/settings/contact-info
 * @desc    Update contact information
 * @access  Admin only
 */
router.put('/contact-info', 
  authenticate, 
  requireRole('superAdmin', 'admin'),
  SettingsController.updateContactInfo
);

/**
 * @route   PUT /api/v1/settings/business-hours
 * @desc    Update business hours
 * @access  Admin only
 */
router.put('/business-hours', 
  authenticate, 
  requireRole('superAdmin', 'admin'),
  SettingsController.updateBusinessHours
);

/**
 * @route   POST /api/v1/settings/maintenance-mode
 * @desc    Toggle maintenance mode
 * @access  Admin only
 */
router.post('/maintenance-mode', 
  authenticate, 
  requireRole('superAdmin', 'admin'),
  SettingsController.toggleMaintenanceMode
);

/**
 * @route   POST /api/v1/settings/reset
 * @desc    Reset settings to defaults
 * @access  SuperAdmin only
 */
router.post('/reset', 
  authenticate, 
  requireRole('superAdmin'),
  SettingsController.resetSettings
);

export default router;
