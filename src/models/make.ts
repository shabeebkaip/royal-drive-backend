import mongoose, { Schema } from 'mongoose';
import { IMake } from '../types/make.js';

// Helper function for generating URL-friendly slugs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

const MakeSchema = new Schema<IMake>({
  name: {
    type: String,
    required: [true, 'Make name is required'],
    trim: true,
    maxlength: [50, 'Make name cannot exceed 50 characters'],
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [60, 'Slug cannot exceed 60 characters']
  },
  logo: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Logo must be a valid URL'
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
MakeSchema.index({ active: 1 });
MakeSchema.index({ name: 'text', description: 'text' }); // Text search index

// Pre-save middleware to always generate slug from name
MakeSchema.pre('save', function(this: IMake, next) {
  // Always generate slug from name (backend responsibility)
  this.slug = generateSlug(this.name);
  next();
});

// Virtual for vehicle count (to be populated if needed)
MakeSchema.virtual('vehicleCount', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'make',
  count: true
});

// Ensure virtuals are included when converting to JSON
MakeSchema.set('toJSON', { virtuals: true });
MakeSchema.set('toObject', { virtuals: true });

export const Make = mongoose.model<IMake>('Make', MakeSchema);
export type { IMake };
