import { Request, Response } from 'express';
import { SettingsService } from '../services/SettingsService.js';
import type { IUpdateBusinessSettingsRequest } from '../types/settings.d.js';
import { validationResult } from 'express-validator';

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class SettingsController {

  /**
   * Get business settings (Public endpoint - for website display)
   * GET /api/v1/settings/public
   */
  static async getPublicSettings(req: Request, res: Response): Promise<Response> {
    try {
      const settings = await SettingsService.getPublicSettings();

      return res.status(200).json({
        success: true,
        message: 'Public settings retrieved successfully',
        data: settings
      });
    } catch (error: any) {
      console.error('Error fetching public settings:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch settings',
        error: error.message
      });
    }
  }

  /**
   * Get all business settings (Admin only)
   * GET /api/v1/settings
   */
  static async getSettings(req: Request, res: Response): Promise<Response> {
    try {
      const settings = await SettingsService.getSettings();

      return res.status(200).json({
        success: true,
        message: 'Settings retrieved successfully',
        data: settings
      });
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch settings',
        error: error.message
      });
    }
  }

  /**
   * Update business settings (Admin only)
   * PUT /api/v1/settings
   */
  static async updateSettings(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const updateData: IUpdateBusinessSettingsRequest = req.body;
      const settings = await SettingsService.updateSettings(updateData);

      return res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: settings
      });
    } catch (error: any) {
      console.error('Error updating settings:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update settings',
        error: error.message
      });
    }
  }

  /**
   * Update social media links only (Admin only)
   * PUT /api/v1/settings/social-media
   */
  static async updateSocialMedia(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const settings = await SettingsService.updateSocialMedia(req.body);

      return res.status(200).json({
        success: true,
        message: 'Social media links updated successfully',
        data: {
          socialMedia: settings.socialMedia
        }
      });
    } catch (error: any) {
      console.error('Error updating social media:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update social media links',
        error: error.message
      });
    }
  }

  /**
   * Update business address only (Admin only)
   * PUT /api/v1/settings/address
   */
  static async updateAddress(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const settings = await SettingsService.updateAddress(req.body);

      return res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: {
          address: settings.address
        }
      });
    } catch (error: any) {
      console.error('Error updating address:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update address',
        error: error.message
      });
    }
  }

  /**
   * Update contact information only (Admin only)
   * PUT /api/v1/settings/contact-info
   */
  static async updateContactInfo(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const settings = await SettingsService.updateContactInfo(req.body);

      return res.status(200).json({
        success: true,
        message: 'Contact information updated successfully',
        data: {
          contactInfo: settings.contactInfo
        }
      });
    } catch (error: any) {
      console.error('Error updating contact info:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update contact information',
        error: error.message
      });
    }
  }

  /**
   * Update business hours only (Admin only)
   * PUT /api/v1/settings/business-hours
   */
  static async updateBusinessHours(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const settings = await SettingsService.updateBusinessHours(req.body.businessHours);

      return res.status(200).json({
        success: true,
        message: 'Business hours updated successfully',
        data: {
          businessHours: settings.businessHours
        }
      });
    } catch (error: any) {
      console.error('Error updating business hours:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update business hours',
        error: error.message
      });
    }
  }

  /**
   * Toggle maintenance mode (Admin only)
   * POST /api/v1/settings/maintenance-mode
   */
  static async toggleMaintenanceMode(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { enabled, message } = req.body;

      if (typeof enabled !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'enabled field must be a boolean'
        });
      }

      const settings = await SettingsService.toggleMaintenanceMode(enabled, message);

      return res.status(200).json({
        success: true,
        message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'} successfully`,
        data: {
          maintenanceMode: settings.maintenanceMode
        }
      });
    } catch (error: any) {
      console.error('Error toggling maintenance mode:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to toggle maintenance mode',
        error: error.message
      });
    }
  }

  /**
   * Reset settings to defaults (SuperAdmin only)
   * POST /api/v1/settings/reset
   */
  static async resetSettings(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const settings = await SettingsService.resetToDefaults();

      return res.status(200).json({
        success: true,
        message: 'Settings reset to defaults successfully',
        data: settings
      });
    } catch (error: any) {
      console.error('Error resetting settings:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to reset settings',
        error: error.message
      });
    }
  }
}
