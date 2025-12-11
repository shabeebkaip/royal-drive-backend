import mongoose, { Schema } from 'mongoose';
import { IModel } from '../types/model.js';

// Helper function for generating URL-friendly slugs
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
}

const ModelSchema = new Schema<IModel>({
  name: {
    type: String,
    required: [true, 'Model name is required'],
    trim: true,
    maxlength: [50, 'Model name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [60, 'Slug cannot exceed 60 characters']
  },
  make: {
    type: Schema.Types.ObjectId,
    ref: 'Make',
    required: [true, 'Make is required']
  },
  vehicleType: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleType',
    required: [true, 'Vehicle type is required']
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

// Compound index for unique model per make and type combination
ModelSchema.index({ name: 1, make: 1 }, { unique: true });

// Indexes for better performance
ModelSchema.index({ active: 1 });
ModelSchema.index({ make: 1 });
ModelSchema.index({ vehicleType: 1 });
ModelSchema.index({ name: 'text', description: 'text' }); // Text search index

// Pre-save middleware to generate slug from name and make
ModelSchema.pre('save', async function(this: IModel, next) {
  // Populate make to get the make name for slug generation
  if (this.isNew || this.isModified('name') || this.isModified('make')) {
    await this.populate('make', 'name');
    const makeName = (this.make as any).name || '';
    const combinedName = `${makeName} ${this.name}`;
    this.slug = generateSlug(combinedName);
  }
  next();
});

// Virtual for vehicle count (to be populated if needed)
ModelSchema.virtual('vehicleCount', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'model',
  count: true
});

// Ensure virtuals are included when converting to JSON
ModelSchema.set('toJSON', { virtuals: true });
ModelSchema.set('toObject', { virtuals: true });

export const Model = mongoose.model<IModel>('Model', ModelSchema);
export type { IModel };
