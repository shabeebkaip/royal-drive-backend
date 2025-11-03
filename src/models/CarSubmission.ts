import mongoose, { Schema } from 'mongoose';
import { ICarSubmission } from '../types/carSubmission.d';

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

const CarSubmissionSchema = new Schema<ICarSubmission>({
  // Car Details
  vehicle: {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
      maxlength: [50, 'Make cannot exceed 50 characters']
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
      maxlength: [50, 'Model cannot exceed 50 characters']
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage cannot be negative']
    },
    condition: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      required: [true, 'Vehicle condition is required']
    },
    bodyType: {
      type: String,
      enum: ['sedan', 'suv', 'coupe', 'hatchback', 'truck', 'convertible', 'wagon', 'other'],
      required: false
    },
    fuelType: {
      type: String,
      enum: ['gasoline', 'diesel', 'hybrid', 'electric', 'other'],
      required: false
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic', 'cvt'],
      required: false
    },
    drivetrain: {
      type: String,
      enum: ['fwd', 'rwd', 'awd', '4wd'],
      required: false
    },
    exteriorColor: {
      type: String,
      required: false,
      trim: true,
      maxlength: [30, 'Exterior color cannot exceed 30 characters']
    },
    interiorColor: {
      type: String,
      required: false,
      trim: true,
      maxlength: [30, 'Interior color cannot exceed 30 characters']
    },
    vin: {
      type: String,
      trim: true,
      maxlength: [17, 'VIN cannot exceed 17 characters']
    },
    licensePlate: {
      type: String,
      trim: true,
      maxlength: [10, 'License plate cannot exceed 10 characters']
    },
    trimLevel: {
      type: String,
      trim: true,
      maxlength: [50, 'Trim level cannot exceed 50 characters']
    },
    engineSize: {
      type: String,
      trim: true,
      maxlength: [50, 'Engine size cannot exceed 50 characters']
    }
  },

  // Pricing Information
  pricing: {
    expectedPrice: {
      type: Number,
      required: [true, 'Expected price is required'],
      min: [0, 'Expected price cannot be negative']
    },
    currency: {
      type: String,
      default: 'CAD',
      enum: ['CAD', 'USD']
    },
    priceFlexible: {
      type: Boolean,
      default: true
    },
    reasonForSelling: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, 'Reason for selling cannot exceed 500 characters']
    }
  },

  // Owner Information
  owner: {
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
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'either'],
      default: 'either'
    },
    preferredContactTime: {
      type: String,
      trim: true,
      maxlength: [100, 'Preferred contact time cannot exceed 100 characters']
    },
    // Backwards compatibility - map to preferredContactMethod
    preferredContact: {
      type: String,
      enum: ['email', 'phone', 'both', 'either'],
      default: 'either'
    },
    bestTimeToCall: {
      type: String,
      trim: true,
      maxlength: [100, 'Best time to call cannot exceed 100 characters']
    }
  },

  // Car History & Features
  history: {
    previousOwners: {
      type: Number,
      required: false,
      min: [1, 'Must have at least 1 owner'],
      max: [20, 'Too many previous owners']
    },
    accidentHistory: {
      type: Boolean,
      required: false
    },
    accidentDescription: {
      type: String,
      trim: true,
      maxlength: [1000, 'Accident description cannot exceed 1000 characters']
    },
    serviceHistory: {
      type: Boolean,
      required: false
    },
    serviceRecords: {
      type: String,
      trim: true,
      maxlength: [1000, 'Service records cannot exceed 1000 characters']
    },
    modifications: {
      type: String,
      trim: true,
      maxlength: [1000, 'Modifications description cannot exceed 1000 characters']
    },
    issues: {
      type: String,
      trim: true,
      maxlength: [1000, 'Issues description cannot exceed 1000 characters']
    }
  },

  features: {
    airConditioning: { type: Boolean, default: false },
    powerSteering: { type: Boolean, default: false },
    powerWindows: { type: Boolean, default: false },
    powerLocks: { type: Boolean, default: false },
    cruiseControl: { type: Boolean, default: false },
    bluetooth: { type: Boolean, default: false },
    navigation: { type: Boolean, default: false },
    sunroof: { type: Boolean, default: false },
    leatherSeats: { type: Boolean, default: false },
    heatedSeats: { type: Boolean, default: false },
    backupCamera: { type: Boolean, default: false },
    parkingSensors: { type: Boolean, default: false },
    alloyWheels: { type: Boolean, default: false },
    premiumSound: { type: Boolean, default: false },
    other: [String]
  },

  // Images and Documents
  media: {
    images: [{
      type: String,
      trim: true
    }],
    documents: [{
      type: String,
      trim: true
    }]
  },

  // Admin Management
  status: {
    type: String,
    enum: ['new', 'reviewing', 'contacted', 'scheduled-inspection', 'inspected', 'offer-made', 'negotiating', 'accepted', 'rejected', 'completed'],
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

  // Evaluation and Notes
  evaluation: {
    estimatedValue: Number,
    marketValue: Number,
    condition: {
      type: String,
      trim: true,
      maxlength: [500, 'Condition notes cannot exceed 500 characters']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Evaluation notes cannot exceed 1000 characters']
    },
    evaluatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    evaluatedAt: Date
  },

  adminNotes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Admin notes cannot exceed 2000 characters'],
    default: ''
  },

  contactHistory: [ContactHistorySchema],

  // Inspection Details
  inspection: {
    scheduledDate: Date,
    completedDate: Date,
    inspector: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Inspection location cannot exceed 200 characters']
    },
    findings: {
      type: String,
      trim: true,
      maxlength: [2000, 'Inspection findings cannot exceed 2000 characters']
    },
    recommendedAction: {
      type: String,
      trim: true,
      maxlength: [1000, 'Recommended action cannot exceed 1000 characters']
    }
  },

  // Offer Details
  offer: {
    amount: {
      type: Number,
      min: [0, 'Offer amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'CAD',
      enum: ['CAD', 'USD']
    },
    validUntil: Date,
    conditions: {
      type: String,
      trim: true,
      maxlength: [1000, 'Offer conditions cannot exceed 1000 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'counter-offered'],
      default: 'pending'
    },
    madeBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    madeAt: Date
  },

  source: {
    type: String,
    enum: ['website', 'phone', 'referral', 'walk-in', 'social-media'],
    default: 'website'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
CarSubmissionSchema.index({ status: 1 });
CarSubmissionSchema.index({ priority: 1 });
CarSubmissionSchema.index({ assignedTo: 1 });
CarSubmissionSchema.index({ 'vehicle.make': 1 });
CarSubmissionSchema.index({ 'vehicle.model': 1 });
CarSubmissionSchema.index({ 'vehicle.year': 1 });
CarSubmissionSchema.index({ 'vehicle.condition': 1 });
CarSubmissionSchema.index({ 'pricing.expectedPrice': 1 });
CarSubmissionSchema.index({ createdAt: -1 });
CarSubmissionSchema.index({ 'owner.email': 1 });

// Compound indexes
CarSubmissionSchema.index({ status: 1, priority: 1 });
CarSubmissionSchema.index({ assignedTo: 1, status: 1 });
CarSubmissionSchema.index({ 'vehicle.make': 1, 'vehicle.model': 1, 'vehicle.year': 1 });

// Text search index
CarSubmissionSchema.index({
  'vehicle.make': 'text',
  'vehicle.model': 'text',
  'owner.firstName': 'text',
  'owner.lastName': 'text',
  'owner.email': 'text',
  'pricing.reasonForSelling': 'text',
  'adminNotes': 'text'
});

// Virtual for full owner name
CarSubmissionSchema.virtual('owner.fullName').get(function() {
  return `${this.owner.firstName} ${this.owner.lastName}`;
});

// Virtual for submission age in days
CarSubmissionSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for vehicle display name
CarSubmissionSchema.virtual('vehicle.displayName').get(function() {
  return `${this.vehicle.year} ${this.vehicle.make} ${this.vehicle.model}`;
});

// Pre-save middleware to auto-assign priority based on vehicle details
CarSubmissionSchema.pre('save', function(next) {
  if (this.isNew) {
    // Auto-assign priority based on expected price and condition
    if (this.pricing.expectedPrice > 50000 || this.vehicle.condition === 'excellent') {
      this.priority = 'high';
    } else if (this.pricing.expectedPrice > 20000 && this.vehicle.condition === 'good') {
      this.priority = 'medium';
    } else {
      this.priority = 'low';
    }

    // Set currency if not provided
    if (!this.pricing.currency) {
      this.pricing.currency = 'CAD';
    }
  }
  next();
});

// Ensure virtuals are included when converting to JSON
CarSubmissionSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id;
    return ret;
  }
});
CarSubmissionSchema.set('toObject', { virtuals: true });

export const CarSubmission = mongoose.model<ICarSubmission>('CarSubmission', CarSubmissionSchema);
export type { ICarSubmission };
