import mongoose, { Schema } from 'mongoose';
import { IBusinessSettings, IBusinessHours, ISocialMedia, IContactInfo, IAddress, ISEOSettings } from '../types/settings.d';

const BusinessHoursSchema = new Schema<IBusinessHours>({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openTime: {
    type: String,
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)']
  },
  closeTime: {
    type: String,
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (use HH:MM)']
  }
}, { _id: false });

const SocialMediaSchema = new Schema<ISocialMedia>({
  facebook: {
    type: String,
    match: [/^https?:\/\/(www\.)?facebook\.com\/.*/, 'Invalid Facebook URL']
  },
  instagram: {
    type: String,
    match: [/^https?:\/\/(www\.)?instagram\.com\/.*/, 'Invalid Instagram URL']
  },
  twitter: {
    type: String,
    match: [/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.*/, 'Invalid Twitter URL']
  },
  linkedin: {
    type: String,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.*/, 'Invalid LinkedIn URL']
  },
  youtube: {
    type: String,
    match: [/^https?:\/\/(www\.)?youtube\.com\/.*/, 'Invalid YouTube URL']
  },
  tiktok: {
    type: String,
    match: [/^https?:\/\/(www\.)?tiktok\.com\/.*/, 'Invalid TikTok URL']
  },
  facebookMarketplace: {
    type: String,
    match: [/^https?:\/\/(www\.)?facebook\.com\/marketplace\/.*/, 'Invalid Facebook Marketplace URL']
  }
}, { _id: false });

const ContactInfoSchema = new Schema<IContactInfo>({
  primaryPhone: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Invalid phone number format']
  },
  secondaryPhone: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Invalid phone number format']
  },
  primaryEmail: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  supportEmail: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  salesEmail: {
    type: String,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  }
}, { _id: false });

const AddressSchema = new Schema<IAddress>({
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  province: {
    type: String,
    required: [true, 'Province/State is required'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    default: 'Canada'
  }
}, { _id: false });

const SEOSettingsSchema = new Schema<ISEOSettings>({
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title should not exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description should not exceed 160 characters']
  },
  metaKeywords: [{
    type: String,
    trim: true
  }],
  ogImage: {
    type: String
  }
}, { _id: false });

const BusinessSettingsSchema = new Schema<IBusinessSettings>({
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    default: 'Royal Drive Canada'
  },
  tagline: {
    type: String,
    trim: true,
    maxlength: [100, 'Tagline cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  logo: {
    type: String
  },
  favicon: {
    type: String
  },
  
  // Contact Information
  contactInfo: {
    type: ContactInfoSchema,
    default: {}
  },
  
  // Address
  address: {
    type: AddressSchema,
    required: true
  },
  
  // Social Media Links
  socialMedia: {
    type: SocialMediaSchema,
    default: {}
  },
  
  // Business Hours
  businessHours: {
    type: [BusinessHoursSchema],
    default: [
      { day: 'Monday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Thursday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Friday', isOpen: true, openTime: '09:00', closeTime: '18:00' },
      { day: 'Saturday', isOpen: true, openTime: '10:00', closeTime: '17:00' },
      { day: 'Sunday', isOpen: false }
    ]
  },
  
  // SEO Settings
  seo: {
    type: SEOSettingsSchema,
    default: {}
  },
  
  // Features & Settings
  features: {
    enableTestDrive: { type: Boolean, default: true },
    enableFinancing: { type: Boolean, default: true },
    enableTradeIn: { type: Boolean, default: true },
    enableOnlineBooking: { type: Boolean, default: true },
    showPricing: { type: Boolean, default: true }
  },
  
  // Email Notifications
  emailNotifications: {
    newEnquiry: { type: Boolean, default: true },
    newVehicleEnquiry: { type: Boolean, default: true },
    newCarSubmission: { type: Boolean, default: true },
    dailyReport: { type: Boolean, default: false },
    recipients: [{
      type: String,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
    }]
  },
  
  // Other Settings
  currency: {
    type: String,
    default: 'CAD',
    enum: ['CAD', 'USD']
  },
  timezone: {
    type: String,
    default: 'America/Toronto'
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'fr']
  },
  
  // Maintenance Mode
  maintenanceMode: {
    enabled: { type: Boolean, default: false },
    message: { type: String, trim: true }
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: { type: String, trim: true },
    facebookPixelId: { type: String, trim: true },
    hotjarId: { type: String, trim: true }
  }
}, {
  timestamps: true,
  collection: 'settings'
});

// Ensure only one settings document exists
BusinessSettingsSchema.index({}, { unique: true });

// Static method to get or create settings
BusinessSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  
  if (!settings) {
    // Create default settings
    settings = await this.create({
      businessName: 'Royal Drive Canada',
      address: {
        street: '751 Danforth Road',
        city: 'Toronto',
        province: 'Ontario',
        postalCode: 'M1K 1G9',
        country: 'Canada'
      }
    });
  }
  
  return settings;
};

export const BusinessSettings = mongoose.model<IBusinessSettings>('BusinessSettings', BusinessSettingsSchema);
