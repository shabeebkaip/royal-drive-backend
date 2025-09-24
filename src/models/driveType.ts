import mongoose, { Schema } from 'mongoose';
import { IDriveType } from '@/types/driveType';

// Helper function for generating URL-friendly slugs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();
}

const driveTypeSchema = new Schema<IDriveType>({
  name: {
    type: String,
    required: [true, 'Drive type name is required'],
    trim: true,
    maxlength: [50, 'Drive type name cannot exceed 50 characters'],
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [60, 'Slug cannot exceed 60 characters']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to generate slug
driveTypeSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = generateSlug(this.name);
  }
  next();
});

// Indexes for better performance (only add indexes for fields that don't have unique: true)
driveTypeSchema.index({ active: 1 });
driveTypeSchema.index({ createdAt: -1 });

// Virtual field to count vehicles using this drive type
driveTypeSchema.virtual('vehicleCount', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'drivetrain',
  count: true
});

// Ensure virtuals are included when converting to JSON
driveTypeSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id;
    return ret;
  }
});
driveTypeSchema.set('toObject', { virtuals: true });

const DriveType = mongoose.model<IDriveType>('DriveType', driveTypeSchema);

export default DriveType;
