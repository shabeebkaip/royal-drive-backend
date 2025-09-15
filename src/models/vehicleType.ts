import mongoose, { Schema } from 'mongoose';
import { IVehicleType } from '@/types/vehicleType';

// Helper function for generating URL-friendly slugs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

const VehicleTypeSchema = new Schema<IVehicleType>({
  name: {
    type: String,
    required: [true, 'Vehicle type name is required'],
    trim: true,
    maxlength: [50, 'Vehicle type name cannot exceed 50 characters'],
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [60, 'Slug cannot exceed 60 characters']
  },
  icon: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Icon must be a valid URL'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
VehicleTypeSchema.index({ active: 1 });
VehicleTypeSchema.index({ name: 'text', description: 'text' }); // Text search index

// Pre-save middleware to always generate slug from name
VehicleTypeSchema.pre('save', function(this: IVehicleType, next) {
  // Always generate slug from name (backend responsibility)
  this.slug = generateSlug(this.name);
  next();
});

// Virtual for vehicle count (to be populated if needed)
VehicleTypeSchema.virtual('vehicleCount', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'type',
  count: true
});

// Ensure virtuals are included when converting to JSON
VehicleTypeSchema.set('toJSON', { virtuals: true });
VehicleTypeSchema.set('toObject', { virtuals: true });

export const VehicleType = mongoose.model<IVehicleType>('VehicleType', VehicleTypeSchema);
export type { IVehicleType };
