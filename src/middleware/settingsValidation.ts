import { body, query } from 'express-validator';

/**
 * Validation for updating business settings
 */
export const validateUpdateSettings = [
  body('businessName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2 and 100 characters'),

  body('tagline')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tagline cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('logo')
    .optional()
    .isURL()
    .withMessage('Logo must be a valid URL'),

  body('favicon')
    .optional()
    .isURL()
    .withMessage('Favicon must be a valid URL'),

  // Contact Info
  body('contactInfo.primaryPhone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Invalid phone number format'),

  body('contactInfo.secondaryPhone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Invalid phone number format'),

  body('contactInfo.primaryEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),

  body('contactInfo.supportEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),

  body('contactInfo.salesEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email format'),

  // Address
  body('address.street')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Street address must be at least 5 characters'),

  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('City must be at least 2 characters'),

  body('address.province')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Province/State must be at least 2 characters'),

  body('address.postalCode')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Postal code must be at least 3 characters'),

  body('address.country')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Country must be at least 2 characters'),

  // Social Media
  body('socialMedia.facebook')
    .optional()
    .matches(/^https?:\/\/(www\.)?facebook\.com\/.*/)
    .withMessage('Invalid Facebook URL'),

  body('socialMedia.instagram')
    .optional()
    .matches(/^https?:\/\/(www\.)?instagram\.com\/.*/)
    .withMessage('Invalid Instagram URL'),

  body('socialMedia.twitter')
    .optional()
    .matches(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.*/)
    .withMessage('Invalid Twitter URL'),

  body('socialMedia.linkedin')
    .optional()
    .matches(/^https?:\/\/(www\.)?linkedin\.com\/.*/)
    .withMessage('Invalid LinkedIn URL'),

  body('socialMedia.youtube')
    .optional()
    .matches(/^https?:\/\/(www\.)?youtube\.com\/.*/)
    .withMessage('Invalid YouTube URL'),

  body('socialMedia.tiktok')
    .optional()
    .matches(/^https?:\/\/(www\.)?tiktok\.com\/.*/)
    .withMessage('Invalid TikTok URL'),

  body('socialMedia.facebookMarketplace')
    .optional()
    .matches(/^https?:\/\/(www\.)?facebook\.com\/marketplace\/.*/)
    .withMessage('Invalid Facebook Marketplace URL'),

  // Business Hours
  body('businessHours')
    .optional()
    .isArray()
    .withMessage('Business hours must be an array'),

  body('businessHours.*.day')
    .optional()
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    .withMessage('Invalid day of week'),

  body('businessHours.*.isOpen')
    .optional()
    .isBoolean()
    .withMessage('isOpen must be a boolean'),

  body('businessHours.*.openTime')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (use HH:MM)'),

  body('businessHours.*.closeTime')
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid time format (use HH:MM)'),

  // SEO
  body('seo.metaTitle')
    .optional()
    .trim()
    .isLength({ max: 60 })
    .withMessage('Meta title should not exceed 60 characters'),

  body('seo.metaDescription')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Meta description should not exceed 160 characters'),

  body('seo.metaKeywords')
    .optional()
    .isArray()
    .withMessage('Meta keywords must be an array'),

  body('seo.ogImage')
    .optional()
    .isURL()
    .withMessage('OG Image must be a valid URL'),

  // Features
  body('features.enableTestDrive')
    .optional()
    .isBoolean()
    .withMessage('enableTestDrive must be a boolean'),

  body('features.enableFinancing')
    .optional()
    .isBoolean()
    .withMessage('enableFinancing must be a boolean'),

  body('features.enableTradeIn')
    .optional()
    .isBoolean()
    .withMessage('enableTradeIn must be a boolean'),

  body('features.enableOnlineBooking')
    .optional()
    .isBoolean()
    .withMessage('enableOnlineBooking must be a boolean'),

  body('features.showPricing')
    .optional()
    .isBoolean()
    .withMessage('showPricing must be a boolean'),

  // Email Notifications
  body('emailNotifications.newEnquiry')
    .optional()
    .isBoolean()
    .withMessage('newEnquiry must be a boolean'),

  body('emailNotifications.recipients')
    .optional()
    .isArray()
    .withMessage('Recipients must be an array'),

  body('emailNotifications.recipients.*')
    .optional()
    .isEmail()
    .withMessage('Invalid email in recipients'),

  // Other Settings
  body('currency')
    .optional()
    .isIn(['CAD', 'USD'])
    .withMessage('Currency must be CAD or USD'),

  body('language')
    .optional()
    .isIn(['en', 'fr'])
    .withMessage('Language must be en or fr'),

  // Maintenance Mode
  body('maintenanceMode.enabled')
    .optional()
    .isBoolean()
    .withMessage('Maintenance mode enabled must be a boolean'),

  body('maintenanceMode.message')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Maintenance message cannot exceed 200 characters'),

  // Analytics
  body('analytics.googleAnalyticsId')
    .optional()
    .trim(),

  body('analytics.facebookPixelId')
    .optional()
    .trim(),

  body('analytics.hotjarId')
    .optional()
    .trim()
];

/**
 * Validation for updating social media links only
 */
export const validateUpdateSocialMedia = [
  body('facebook')
    .optional()
    .matches(/^https?:\/\/(www\.)?facebook\.com\/.*/)
    .withMessage('Invalid Facebook URL'),

  body('instagram')
    .optional()
    .matches(/^https?:\/\/(www\.)?instagram\.com\/.*/)
    .withMessage('Invalid Instagram URL'),

  body('twitter')
    .optional()
    .matches(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.*/)
    .withMessage('Invalid Twitter URL'),

  body('linkedin')
    .optional()
    .matches(/^https?:\/\/(www\.)?linkedin\.com\/.*/)
    .withMessage('Invalid LinkedIn URL'),

  body('youtube')
    .optional()
    .matches(/^https?:\/\/(www\.)?youtube\.com\/.*/)
    .withMessage('Invalid YouTube URL'),

  body('tiktok')
    .optional()
    .matches(/^https?:\/\/(www\.)?tiktok\.com\/.*/)
    .withMessage('Invalid TikTok URL'),

  body('facebookMarketplace')
    .optional()
    .matches(/^https?:\/\/(www\.)?facebook\.com\/marketplace\/.*/)
    .withMessage('Invalid Facebook Marketplace URL')
];

/**
 * Validation for updating address only
 */
export const validateUpdateAddress = [
  body('street')
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage('Street address must be at least 5 characters'),

  body('city')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('City must be at least 2 characters'),

  body('province')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Province/State must be at least 2 characters'),

  body('postalCode')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Postal code must be at least 3 characters'),

  body('country')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Country must be at least 2 characters')
];
