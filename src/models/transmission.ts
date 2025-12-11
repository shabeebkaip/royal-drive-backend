import mongoose, { Schema } from 'mongoose';
import { ITransmission } from '../types/transmission.js';

const transmissionSchema = new Schema<ITransmission>({
  name: {
    type: String,
    required: [true, 'Transmission name is required'],
    trim: true,
    minlength: [2, 'Transmission name must be at least 2 characters'],
    maxlength: [50, 'Transmission name cannot exceed 50 characters'],
    match: [/^[a-zA-Z0-9\s\-]+$/, 'Transmission name can only contain letters, numbers, spaces, and hyphens']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Create index for better performance
// Note: slug already has unique: true, so no separate index needed
// Note: name has unique compound index below, so no separate basic index needed
transmissionSchema.index({ active: 1 });
transmissionSchema.index({ name: 'text' });

// Create unique compound index for name (case-insensitive)
transmissionSchema.index(
  { name: 1 }, 
  { 
    unique: true,
    collation: { locale: 'en', strength: 2 }
  }
);

// Pre-save middleware to generate slug
transmissionSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Pre-update middleware to generate slug
transmissionSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  const update = this.getUpdate() as any;
  if (update.name) {
    update.slug = update.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Virtual for vehicle count (to be populated if needed)
transmissionSchema.virtual('vehicleCount', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'transmission.type',
  count: true
});

// Ensure virtuals are included when converting to JSON
transmissionSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id;
    return ret;
  }
});
transmissionSchema.set('toObject', { virtuals: true });

const Transmission = mongoose.model<ITransmission>('Transmission', transmissionSchema);

export default Transmission;
