import mongoose, { Schema } from 'mongoose';
import { IMake } from '@/types/make';

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
    required: [true, 'Slug is required'],
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
  country: {
    type: String,
    trim: true,
    maxlength: [50, 'Country cannot exceed 50 characters']
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL'
    }
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
MakeSchema.index({ name: 1 });
MakeSchema.index({ slug: 1 });
MakeSchema.index({ active: 1 });
MakeSchema.index({ country: 1 });

// Pre-save middleware to generate slug from name
MakeSchema.pre('save', function(this: IMake, next) {
  if (!this.slug || this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Virtual for vehicle count (to be populated if needed)
MakeSchema.virtual('vehicleCount', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'make',
  count: true
});

export const Make = mongoose.model<IMake>('Make', MakeSchema);
export type { IMake };
