import mongoose, { Schema } from 'mongoose';
import { IFuelType } from '../types/fuelType.js';

const fuelTypeSchema = new Schema<IFuelType>({
  name: {
    type: String,
    required: [true, 'Fuel type name is required'],
    trim: true,
    minlength: [2, 'Fuel type name must be at least 2 characters long'],
    maxlength: [50, 'Fuel type name cannot exceed 50 characters'],
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Create index for performance (name and slug already have unique: true)
fuelTypeSchema.index({ active: 1 });

// Virtual field for vehicle count
fuelTypeSchema.virtual('vehicleCount', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'engine.fuelType',
  count: true
});

// Pre-save middleware to generate slug
fuelTypeSchema.pre('save', function(next) {
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
fuelTypeSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
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
fuelTypeSchema.virtual('vehicleCount', {
  ref: 'Vehicle',
  localField: '_id',
  foreignField: 'engine.fuelType',
  count: true
});

// Ensure virtuals are included when converting to JSON
fuelTypeSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.id;
    return ret;
  }
});
fuelTypeSchema.set('toObject', { virtuals: true });

const FuelType = mongoose.model<IFuelType>('FuelType', fuelTypeSchema);

export default FuelType;
