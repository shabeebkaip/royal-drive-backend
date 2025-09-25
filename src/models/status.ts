import mongoose, { Schema } from 'mongoose';
import { IStatus } from '../types/status';

// Helper function for generating URL-friendly slugs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();
}

const statusSchema = new Schema<IStatus>({
  name: {
    type: String,
    required: [true, 'Status name is required'],
    trim: true,
    maxlength: [50, 'Status name cannot exceed 50 characters'],
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [60, 'Slug cannot exceed 60 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  color: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
      },
      message: 'Color must be a valid hex color code (e.g., #28a745)'
    }
  },
  icon: {
    type: String,
    trim: true,
    maxlength: [100, 'Icon cannot exceed 100 characters']
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug
statusSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = generateSlug(this.name);
  }
  next();
});

// Ensure only one default status exists
statusSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    // Remove default flag from other statuses
    await mongoose.model('Status').updateMany(
      { _id: { $ne: this._id }, isDefault: true },
      { isDefault: false }
    );
  }
  next();
});

// Indexes for better performance (only add indexes for fields that don't have unique: true)
statusSchema.index({ active: 1 });
statusSchema.index({ isDefault: 1 });
statusSchema.index({ createdAt: -1 });

// Virtual field to count vehicles using this status
statusSchema.virtual('vehicleCount', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'status',
  count: true
});

// Ensure virtuals are included when converting to JSON
statusSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id;
    return ret;
  }
});
statusSchema.set('toObject', { virtuals: true });

const Status = mongoose.model<IStatus>('Status', statusSchema);

export default Status;
