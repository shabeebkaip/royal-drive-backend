import mongoose, { Schema } from 'mongoose';
import {IVehicle} from "@/types/vehicle";

// Vehicle interface for car dealership in Ontario, Toronto
const VehicleSchema = new Schema<IVehicle>({
  // Basic Vehicle Information
  vin: {
    type: String,
  // VIN is optional per client request
    uppercase: true,
    trim: true,
    minlength: [17, 'VIN must be 17 characters'],
    maxlength: [17, 'VIN must be 17 characters'],
    validate: {
      validator: function(v: string) {
        return /^[A-HJ-NPR-Z0-9]{17}$/.test(v);
      },
      message: 'Invalid VIN format'
    }
  },
  make: {
    type: Schema.Types.ObjectId,
    ref: 'Make',
    required: [true, 'Make is required']
  },
  model: {
    type: Schema.Types.ObjectId,
    ref: 'Model',
    required: [true, 'Model is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 2, 'Year cannot be more than 2 years in the future']
  },
  trim: {
    type: String,
    trim: true,
    maxlength: [50, 'Trim cannot exceed 50 characters']
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleType',
    required: [true, 'Vehicle type is required']
  },

  // Engine & Performance
  engine: {
    size: {
      type: Number,
      required: [true, 'Engine size is required'],
      min: [0.5, 'Engine size must be at least 0.5L']
    },
    cylinders: {
      type: Number,
      required: [true, 'Number of cylinders is required'],
      min: [1, 'Must have at least 1 cylinder']
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['gasoline', 'diesel', 'hybrid', 'electric', 'plug-in-hybrid']
    },
    horsepower: Number,
    torque: Number
  },

  // Transmission
  transmission: {
    type: {
      type: String,
      required: [true, 'Transmission type is required'],
      enum: ['manual', 'automatic', 'cvt']
    },
    speeds: Number
  },

  // Drivetrain
  drivetrain: {
    type: String,
    required: [true, 'Drivetrain is required'],
    enum: ['fwd', 'rwd', 'awd', '4wd']
  },

  // Mileage
  odometer: {
    value: {
      type: Number,
      required: [true, 'Odometer reading is required'],
      min: [0, 'Odometer cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Odometer unit is required'],
      enum: ['km', 'miles'],
      default: 'km'
    },
    isAccurate: {
      type: Boolean,
      default: true
    }
  },

  // Condition & History
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: ['new', 'used', 'certified-pre-owned']
  },
  accidentHistory: {
    type: Boolean,
    required: [true, 'Accident history must be specified'],
    default: false
  },
  numberOfPreviousOwners: {
    type: Number,
    required: [true, 'Number of previous owners is required'],
    min: [0, 'Cannot have negative previous owners'],
    default: 0
  },


  // CarFax Information
  carfax: {
    reportUrl: String,
    reportId: String,
    hasCleanHistory: {
      type: Boolean,
      required: [true, 'CarFax history status is required'],
      default: true
    },
    lastUpdated: Date,
    serviceRecords: {
      type: Number,
      default: 0
    }
  },

  // Pricing
  pricing: {
    listPrice: {
      type: Number,
      required: [true, 'List price is required'],
      min: [0, 'Price cannot be negative']
    },
    msrp: Number,
    dealerCost: Number,
    tradeInValue: Number,
    marketValue: Number,
    currency: {
      type: String,
      default: 'CAD',
      enum: ['CAD']
    },
    taxes: {
      hst: {
        type: Number,
        default: 13 // 13% HST in Ontario
      },
      licensing: {
        type: Number,
        default: 0
      },
      other: Number
    },
    financing: {
      available: {
        type: Boolean,
        default: true
      },
      rate: Number,
      term: Number,
      monthlyPayment: Number
    }
  },

  // Features & Options
  features: {
    exterior: [String],
    interior: [String],
    safety: [String],
    technology: [String],
    convenience: [String]
  },

  // Physical Specifications
  specifications: {
    exteriorColor: {
      type: String,
      required: [true, 'Exterior color is required'],
      trim: true
    },
    interiorColor: {
      type: String,
      required: [true, 'Interior color is required'],
      trim: true
    },
    doors: {
      type: Number,
      required: [true, 'Number of doors is required'],
      min: [2, 'Must have at least 2 doors']
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: [1, 'Must seat at least 1 person']
    },
    fuelTankCapacity: Number,
    fuelEconomy: {
      city: Number,
      highway: Number,
      combined: Number
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      wheelbase: Number,
      weight: Number
    }
  },



  // Status
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['available', 'sold', 'pending', 'reserved', 'on-hold'],
    default: 'available'
  },
  availability: {
    inStock: {
      type: Boolean,
      required: [true, 'Stock status is required'],
      default: true
    },
    estimatedArrival: Date,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // Media
  media: {
    images: {
      type: [String],
      validate: {
        validator: function(v: string[]) {
          return v.length > 0;
        },
        message: 'At least one image is required'
      }
    },
    videos: [String],
    documents: [String]
  },

  // Warranty
  warranty: {
    manufacturer: {
      hasWarranty: {
        type: Boolean,
        default: false
      },
      expiryDate: Date,
      kilometersRemaining: Number,
      type: String
    },
    extended: {
      available: {
        type: Boolean,
        default: false
      },
      provider: String,
      cost: Number,
      duration: Number
    }
  },

  // Ontario Specific
  ontario: {
    emissionTest: {
      required: {
        type: Boolean,
        default: function(this: IVehicle) {
          return this.year >= 1988 && this.condition !== 'new';
        }
      },
      passed: Boolean,
      expiryDate: Date
    },
    safetyStandard: {
      passed: {
        type: Boolean,
        required: [true, 'Safety standard status is required'],
        default: false
      },
      certificationDate: Date,
      expiryDate: Date,
      inspector: String
    },
    uvip: {
      required: {
        type: Boolean,
        default: function(this: IVehicle) {
          return this.condition !== 'new';
        }
      },
      obtained: Boolean,
      cost: {
        type: Number,
        default: 20 // Standard UVIP cost in Ontario
      }
    }
  },

  // Internal Tracking
  internal: {
    stockNumber: {
      type: String,
      required: [true, 'Stock number is required'],
      unique: true,
      trim: true
    },
    acquisitionDate: {
      type: Date,
      required: [true, 'Acquisition date is required'],
      default: Date.now
    },
    acquisitionCost: Number,
    daysInInventory: {
      type: Number,
      default: 0
    },
    lastServiceDate: Date,
    nextServiceDue: Date,
    assignedSalesperson: String,
    notes: String
  },

  // SEO & Marketing
  marketing: {
    featured: {
      type: Boolean,
      default: false
    },
    specialOffer: String,
    keywords: [String],
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    slug: {
      type: String,
      required: [true, 'URL slug is required'],
      unique: true,
      trim: true,
      lowercase: true
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
// Ensure VIN is unique only when provided (VIN optional overall)
VehicleSchema.index({ vin: 1 }, { unique: true, partialFilterExpression: { vin: { $type: 'string' } } });
VehicleSchema.index({ make: 1, model: 1, year: 1 });
VehicleSchema.index({ status: 1 });
VehicleSchema.index({ 'pricing.listPrice': 1 });
VehicleSchema.index({ condition: 1 });
VehicleSchema.index({ bodyType: 1 });
VehicleSchema.index({ 'engine.fuelType': 1 });
VehicleSchema.index({ createdAt: -1 });

// Virtual for calculating days in inventory
VehicleSchema.virtual('daysInInventoryCalculated').get(function(this: IVehicle) {
  const now = new Date();
  const acquisitionDate = new Date(this.internal.acquisitionDate);
  const diffTime = Math.abs(now.getTime() - acquisitionDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update days in inventory
VehicleSchema.pre('save', function(this: IVehicle, next) {
  if (this.internal.acquisitionDate) {
    const now = new Date();
    const acquisitionDate = new Date(this.internal.acquisitionDate);
    const diffTime = Math.abs(now.getTime() - acquisitionDate.getTime());
    this.internal.daysInInventory = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  next();
});

// Indexes for better performance
VehicleSchema.index({ make: 1 });
VehicleSchema.index({ year: 1 });
VehicleSchema.index({ 'status.availability': 1 });

// Text search index
VehicleSchema.index({
  model: 'text',
  'features.exterior': 'text',
  'features.interior': 'text',
  'features.safety': 'text',
  'features.technology': 'text'
});

// Generate slug from make, model, year, and stock number
VehicleSchema.pre('save', async function(this: IVehicle, next) {
  if (!this.marketing.slug || this.isModified('make') || this.isModified('model') || this.isModified('year') || this.isModified('internal.stockNumber')) {
    // Populate make to get the name for slug generation
    let makeSlug = 'unknown';
    if (this.make) {
      try {
        const Make = mongoose.model('Make');
        const makeDoc = await Make.findById(this.make).select('slug name');
        makeSlug = makeDoc?.slug || makeDoc?.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'unknown';
      } catch (error) {
        console.warn('Could not populate make for slug generation:', error);
      }
    }
    
    const slug = `${this.year}-${makeSlug}-${this.model}-${this.internal.stockNumber}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    this.marketing.slug = slug;
  }
  next();
});

// Export the model
export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
export type { IVehicle };
