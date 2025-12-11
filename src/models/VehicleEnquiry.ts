import mongoose, { Schema } from 'mongoose';
import type { IVehicleEnquiry } from '../types/vehicleEnquiry.d.js';

const ContactHistorySchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: ['email', 'phone', 'in-person'],
    required: true
  },
  notes: {
    type: String,
    required: [true, 'Contact notes are required'],
    maxlength: [1000, 'Contact notes cannot exceed 1000 characters']
  },
  contactedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { _id: false });

const VehicleEnquirySchema = new Schema<IVehicleEnquiry>({
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle reference is required']
  },
  customer: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
    },
    preferredContact: {
      type: String,
      enum: ['email', 'phone', 'both'],
      default: 'both'
    }
  },
  enquiry: {
    type: {
      type: String,
      enum: ['general', 'financing', 'trade-in', 'test-drive', 'price-negotiation'],
      required: [true, 'Enquiry type is required']
    },
    message: {
      type: String,
      required: [true, 'Enquiry message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    preferredDate: {
      type: Date
    },
    preferredTime: {
      type: String,
      trim: true
    }
  },
  interests: {
    testDrive: {
      type: Boolean,
      default: false
    },
    financing: {
      type: Boolean,
      default: false
    },
    tradeIn: {
      type: Boolean,
      default: false
    },
    warranty: {
      type: Boolean,
      default: false
    }
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'completed', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Admin notes cannot exceed 2000 characters'],
    default: ''
  },
  contactHistory: [ContactHistorySchema],
  source: {
    type: String,
    enum: ['website', 'phone', 'showroom', 'social-media', 'referral'],
    default: 'website'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
VehicleEnquirySchema.index({ vehicle: 1 });
VehicleEnquirySchema.index({ status: 1 });
VehicleEnquirySchema.index({ priority: 1 });
VehicleEnquirySchema.index({ assignedTo: 1 });
VehicleEnquirySchema.index({ createdAt: -1 });
VehicleEnquirySchema.index({ 'customer.email': 1 });
VehicleEnquirySchema.index({ 'enquiry.type': 1 });

// Compound indexes
VehicleEnquirySchema.index({ status: 1, priority: 1 });
VehicleEnquirySchema.index({ assignedTo: 1, status: 1 });

// Text search index
VehicleEnquirySchema.index({
  'customer.firstName': 'text',
  'customer.lastName': 'text',
  'customer.email': 'text',
  'enquiry.message': 'text',
  'adminNotes': 'text'
});

// Virtual for full customer name
VehicleEnquirySchema.virtual('customer.fullName').get(function() {
  return `${this.customer.firstName} ${this.customer.lastName}`;
});

// Virtual for enquiry age in hours
VehicleEnquirySchema.virtual('ageInHours').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60));
});

// Pre-save middleware to auto-assign priority based on enquiry type
VehicleEnquirySchema.pre('save', function(next) {
  if (this.isNew) {
    // Auto-assign priority based on enquiry type
    switch (this.enquiry.type) {
      case 'test-drive':
        this.priority = 'high';
        break;
      case 'financing':
      case 'price-negotiation':
        this.priority = 'medium';
        break;
      default:
        this.priority = 'low';
        break;
    }
  }
  next();
});

// Ensure virtuals are included when converting to JSON
VehicleEnquirySchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id;
    return ret;
  }
});
VehicleEnquirySchema.set('toObject', { virtuals: true });

export const VehicleEnquiry = mongoose.model<IVehicleEnquiry>('VehicleEnquiry', VehicleEnquirySchema);
export type { IVehicleEnquiry };
