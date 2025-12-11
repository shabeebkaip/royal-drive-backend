import mongoose, { Schema } from 'mongoose';
import { IContactEnquiry } from '../types/contactEnquiry.d.js';

const ContactEnquirySchema = new Schema<IContactEnquiry>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: ['General Inquiry', 'Vehicle Information', 'Financing Question', 'Trade-in Valuation', 'Service Question'],
    default: 'General Inquiry'
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'social-media', 'referral'],
    default: 'website'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: {
      type: String,
      required: true,
      maxlength: [1000, 'Note cannot exceed 1000 characters']
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  contactHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    method: {
      type: String,
      enum: ['email', 'phone', 'in-person'],
      required: true
    },
    notes: {
      type: String,
      required: true,
      maxlength: [1000, 'Contact notes cannot exceed 1000 characters']
    },
    contactedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  resolvedAt: {
    type: Date
  },
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ContactEnquirySchema.index({ email: 1 });
ContactEnquirySchema.index({ status: 1 });
ContactEnquirySchema.index({ createdAt: -1 });
ContactEnquirySchema.index({ assignedTo: 1 });
ContactEnquirySchema.index({ subject: 1 });

// Virtual for full name
ContactEnquirySchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to mark as resolved
ContactEnquirySchema.methods.markAsResolved = function(userId: mongoose.Types.ObjectId) {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.resolvedBy = userId;
  return this.save();
};

// Method to add note
ContactEnquirySchema.methods.addNote = function(content: string, userId: mongoose.Types.ObjectId) {
  this.notes.push({
    content,
    createdBy: userId,
    createdAt: new Date()
  });
  return this.save();
};

// Method to add contact history
ContactEnquirySchema.methods.addContactHistory = function(method: string, notes: string, userId: mongoose.Types.ObjectId) {
  this.contactHistory.push({
    date: new Date(),
    method,
    notes,
    contactedBy: userId
  });
  return this.save();
};

// Pre-save middleware to auto-resolve timestamp
ContactEnquirySchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  next();
});

export const ContactEnquiry = mongoose.model<IContactEnquiry>('ContactEnquiry', ContactEnquirySchema);
