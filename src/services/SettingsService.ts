import { BusinessSettings } from '../models/Settings.js';
import { IBusinessSettings, IUpdateBusinessSettingsRequest } from '../types/settings.d.js';

export class SettingsService {
  
  /**
   * Get business settings (Public and Admin)
   */
  static async getSettings(): Promise<IBusinessSettings> {
    // @ts-ignore - getSettings is a static method we defined
    const settings = await BusinessSettings.getSettings();
    return settings;
  }

  /**
   * Update business settings (Admin only)
   */
  static async updateSettings(updateData: IUpdateBusinessSettingsRequest): Promise<IBusinessSettings> {
    let settings = await BusinessSettings.findOne();
    
    if (!settings) {
      // @ts-ignore
      settings = await BusinessSettings.getSettings();
    }

    if (!settings) {
      throw new Error('Failed to initialize settings');
    }

    // Update fields
    if (updateData.businessName !== undefined) settings.businessName = updateData.businessName;
    if (updateData.tagline !== undefined) settings.tagline = updateData.tagline;
    if (updateData.description !== undefined) settings.description = updateData.description;
    if (updateData.logo !== undefined) settings.logo = updateData.logo;
    if (updateData.favicon !== undefined) settings.favicon = updateData.favicon;
    
    // Update contact info
    if (updateData.contactInfo) {
      settings.contactInfo = {
        ...settings.contactInfo,
        ...updateData.contactInfo
      };
    }
    
    // Update address
    if (updateData.address) {
      settings.address = {
        ...settings.address,
        ...updateData.address
      };
    }
    
    // Update social media
    if (updateData.socialMedia) {
      settings.socialMedia = {
        ...settings.socialMedia,
        ...updateData.socialMedia
      };
    }
    
    // Update business hours
    if (updateData.businessHours) {
      settings.businessHours = updateData.businessHours;
    }
    
    // Update SEO settings
    if (updateData.seo) {
      settings.seo = {
        ...settings.seo,
        ...updateData.seo
      };
    }
    
    // Update features
    if (updateData.features) {
      settings.features = {
        ...settings.features,
        ...updateData.features
      };
    }
    
    // Update email notifications
    if (updateData.emailNotifications) {
      settings.emailNotifications = {
        ...settings.emailNotifications,
        ...updateData.emailNotifications
      };
    }
    
    // Update other settings
    if (updateData.currency !== undefined) settings.currency = updateData.currency;
    if (updateData.timezone !== undefined) settings.timezone = updateData.timezone;
    if (updateData.language !== undefined) settings.language = updateData.language;
    
    // Update maintenance mode
    if (updateData.maintenanceMode) {
      settings.maintenanceMode = {
        ...settings.maintenanceMode,
        ...updateData.maintenanceMode
      };
    }
    
    // Update analytics
    if (updateData.analytics) {
      settings.analytics = {
        ...settings.analytics,
        ...updateData.analytics
      };
    }

    await settings.save();
    return settings;
  }

  /**
   * Get public settings (for website display)
   */
  static async getPublicSettings() {
    const settings = await this.getSettings();
    
    return {
      businessName: settings.businessName,
      tagline: settings.tagline,
      description: settings.description,
      logo: settings.logo,
      favicon: settings.favicon,
      contactInfo: settings.contactInfo,
      address: settings.address,
      socialMedia: settings.socialMedia,
      businessHours: settings.businessHours,
      seo: settings.seo,
      features: settings.features,
      currency: settings.currency,
      timezone: settings.timezone,
      language: settings.language,
      maintenanceMode: settings.maintenanceMode
    };
  }

  /**
   * Update social media links only (Admin)
   */
  static async updateSocialMedia(socialMedia: Partial<IBusinessSettings['socialMedia']>): Promise<IBusinessSettings> {
    return await this.updateSettings({ socialMedia });
  }

  /**
   * Update business address only (Admin)
   */
  static async updateAddress(address: Partial<IBusinessSettings['address']>): Promise<IBusinessSettings> {
    return await this.updateSettings({ address });
  }

  /**
   * Update contact info only (Admin)
   */
  static async updateContactInfo(contactInfo: Partial<IBusinessSettings['contactInfo']>): Promise<IBusinessSettings> {
    return await this.updateSettings({ contactInfo });
  }

  /**
   * Update business hours only (Admin)
   */
  static async updateBusinessHours(businessHours: IBusinessSettings['businessHours']): Promise<IBusinessSettings> {
    return await this.updateSettings({ businessHours });
  }

  /**
   * Toggle maintenance mode (Admin)
   */
  static async toggleMaintenanceMode(enabled: boolean, message?: string): Promise<IBusinessSettings> {
    const maintenanceMode: { enabled: boolean; message?: string } = { enabled };
    if (message !== undefined) {
      maintenanceMode.message = message;
    }
    return await this.updateSettings({ maintenanceMode });
  }

  /**
   * Reset settings to default (SuperAdmin only)
   */
  static async resetToDefaults(): Promise<IBusinessSettings> {
    await BusinessSettings.deleteMany({});
    // @ts-ignore
    return await BusinessSettings.getSettings();
  }
}
