import { Document } from 'mongoose';

export interface IBusinessHours {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}

export interface ISocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  facebookMarketplace?: string;
}

export interface IContactInfo {
  primaryPhone?: string;
  secondaryPhone?: string;
  primaryEmail?: string;
  supportEmail?: string;
  salesEmail?: string;
}

export interface IAddress {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface ISEOSettings {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
}

export interface IBusinessSettings extends Document {
  businessName: string;
  tagline?: string;
  description?: string;
  logo?: string;
  favicon?: string;
  
  // Contact Information
  contactInfo: IContactInfo;
  
  // Address
  address: IAddress;
  
  // Social Media Links
  socialMedia: ISocialMedia;
  
  // Business Hours
  businessHours: IBusinessHours[];
  
  // SEO Settings
  seo: ISEOSettings;
  
  // Features & Settings
  features: {
    enableTestDrive?: boolean;
    enableFinancing?: boolean;
    enableTradeIn?: boolean;
    enableOnlineBooking?: boolean;
    showPricing?: boolean;
  };
  
  // Email Notifications
  emailNotifications: {
    newEnquiry?: boolean;
    newVehicleEnquiry?: boolean;
    newCarSubmission?: boolean;
    dailyReport?: boolean;
    recipients?: string[];
  };
  
  // Other Settings
  currency: string;
  timezone: string;
  language: string;
  
  // Maintenance Mode
  maintenanceMode: {
    enabled: boolean;
    message?: string;
  };
  
  // Analytics
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    hotjarId?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateBusinessSettingsRequest {
  businessName?: string;
  tagline?: string;
  description?: string;
  logo?: string;
  favicon?: string;
  contactInfo?: Partial<IContactInfo>;
  address?: Partial<IAddress>;
  socialMedia?: Partial<ISocialMedia>;
  businessHours?: IBusinessHours[];
  seo?: Partial<ISEOSettings>;
  features?: Partial<IBusinessSettings['features']>;
  emailNotifications?: Partial<IBusinessSettings['emailNotifications']>;
  currency?: string;
  timezone?: string;
  language?: string;
  maintenanceMode?: Partial<IBusinessSettings['maintenanceMode']>;
  analytics?: Partial<IBusinessSettings['analytics']>;
}
