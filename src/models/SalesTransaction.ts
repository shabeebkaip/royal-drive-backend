import mongoose, { Schema, model } from 'mongoose';
import { Vehicle } from './vehicle.js';
import Status from './status.js';
import type { ISalesTransaction } from '../types/sales.d.js';

const SalesTransactionSchema = new Schema<ISalesTransaction>({
  vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
  customerName: { type: String, required: true, trim: true, maxlength: 120 },
  customerEmail: { type: String, trim: true, lowercase: true },
  salePrice: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ['CAD','USD'], default: 'CAD' },
  costOfGoods: { type: Number, min: 0 },
  margin: { type: Number, min: 0 },
  salesperson: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  status: { type: String, enum: ['pending','completed','cancelled'], default: 'pending', index: true },
  paymentMethod: { type: String, enum: ['cash','finance','lease'] },
  closedAt: { type: Date },
  // New financial + metadata fields
  discount: { type: Number, min: 0, default: 0 },          // Absolute discount amount
  taxRate: { type: Number, min: 0, max: 1, default: 0 },    // e.g. 0.13 for 13%
  taxAmount: { type: Number, min: 0, default: 0 },
  grossPrice: { type: Number, min: 0 },                     // Base sale price before discount
  totalPrice: { type: Number, min: 0 },                     // Final amount after discount + tax
  externalDealId: { type: String, index: true },
  notes: { type: String, maxlength: 500 },
  meta: { type: Schema.Types.Mixed }
}, {
  timestamps: true,
  versionKey: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Useful compound indexes
SalesTransactionSchema.index({ status: 1, createdAt: -1 });
SalesTransactionSchema.index({ salesperson: 1, status: 1 });
SalesTransactionSchema.index({ closedAt: -1 });

// Virtual percent margin
SalesTransactionSchema.virtual('marginPercent').get(function(this: ISalesTransaction) {
  if (this.margin != null && this.salePrice) {
    return this.salePrice === 0 ? 0 : +(this.margin / this.salePrice).toFixed(4);
  }
  return undefined;
});

// Recompute derived financial fields
SalesTransactionSchema.methods.recalculateFinancials = function(this: ISalesTransaction) {
  if (this.salePrice != null) {
    this.grossPrice = this.salePrice; // baseline
    const discount = this.discount || 0;
    const base = Math.max(0, this.grossPrice - discount);
    const rate = this.taxRate || 0;
    this.taxAmount = +(base * rate).toFixed(2);
    this.totalPrice = +(base + this.taxAmount).toFixed(2);
  }
  if (this.salePrice != null && this.costOfGoods != null) {
    this.margin = this.salePrice - this.costOfGoods;
  }
};

// Pre-save margin calculation
SalesTransactionSchema.pre('save', function(next) {
  if (
    this.isModified('salePrice') ||
    this.isModified('costOfGoods') ||
    this.isModified('discount') ||
    this.isModified('taxRate')
  ) {
    this.recalculateFinancials();
  }
  if (this.isModified('status') && this.status === 'completed' && !this.closedAt) {
    this.closedAt = new Date();
  }
  next();
});

// Simple email validator
SalesTransactionSchema.path('customerEmail').validate(function(v: string | undefined) {
  if (!v) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}, 'Invalid email');

// Transition helpers
SalesTransactionSchema.methods.markCompleted = function(this: ISalesTransaction) {
  if (this.status === 'completed') return Promise.resolve(this);
  this.status = 'completed';
  this.closedAt = new Date();
  return this.save();
};
SalesTransactionSchema.methods.markCancelled = function(this: ISalesTransaction) {
  if (this.status === 'cancelled') return Promise.resolve(this);
  if (this.status === 'completed') {
    throw new Error('Cannot cancel a completed sale');
  }
  this.status = 'cancelled';
  return this.save();
};

// Aggregated summary static
SalesTransactionSchema.statics.buildSummary = async function(params: { from?: Date; to?: Date; salesperson?: string }) {
  const match: any = {};
  if (params.from || params.to) {
    match.createdAt = {};
    if (params.from) match.createdAt.$gte = params.from;
    if (params.to) match.createdAt.$lte = params.to;
  }
  if (params.salesperson) match.salesperson = new mongoose.Types.ObjectId(params.salesperson);
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
        totalGross: { $sum: '$salePrice' },
        totalMargin: { $sum: '$margin' }
      }
    }
  ]);
};

// After save: if sale completed, set vehicle status to sold (idempotent)
SalesTransactionSchema.post('save', async function(doc: ISalesTransaction) {
  if (doc.status === 'completed' && doc.vehicle) {
    try {
      // Find the "sold" status ObjectId
      const soldStatus = await Status.findOne({ 
        $or: [
          { slug: 'sold' },
          { name: { $regex: /^sold$/i } }
        ]
      }).select('_id');
      
      if (soldStatus) {
        await Vehicle.updateOne(
          { _id: doc.vehicle, status: { $ne: soldStatus._id } }, 
          { $set: { status: soldStatus._id } }
        );
        console.log(`Vehicle ${doc.vehicle} marked as sold for sale ${doc._id}`);
      } else {
        console.warn('No "sold" status found in Status collection');
      }
    } catch (err) {
      console.warn('Failed to mark vehicle as sold for sale', String(doc._id), err);
    }
  }
});

export const SalesTransaction = model<ISalesTransaction>('SalesTransaction', SalesTransactionSchema);
export type { ISalesTransaction };
