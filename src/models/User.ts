import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import type { IUser } from '../types/user.d.js';
import { ROLE_PERMISSIONS } from '../types/user.d.js';

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  
  firstName: {
    type: String,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  
  role: {
    type: String,
    enum: ['superAdmin', 'admin', 'manager', 'salesperson'],
    required: [true, 'User role is required'],
    default: 'salesperson'
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  
  permissions: [{
    type: String,
    enum: [
      'vehicles:view',
      'vehicles:create',
      'vehicles:update',
      'vehicles:delete',
      'vehicles:view:internal',
      'users:view',
      'users:create',
      'users:update',
      'users:delete',
      'system:settings',
      'system:reports',
      'masterdata:view',
      'masterdata:manage'
    ]
  }],
  
  profile: {
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
    },
    avatar: {
      type: String,
      trim: true
    },
    department: {
      type: String,
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters']
    },
    hireDate: {
      type: Date
    }
  },
  
  lastLogin: {
    type: Date
  },
  
  passwordResetToken: {
    type: String,
    select: false
  },
  
  passwordResetExpires: {
    type: Date,
    select: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete (ret as any).password;
      delete (ret as any).passwordResetToken;
      delete (ret as any).passwordResetExpires;
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Indexes (email already has unique: true, so no need for separate index)
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware to set role-based permissions
userSchema.pre('save', function(next) {
  if (this.isModified('role') || this.isNew) {
    this.permissions = ROLE_PERMISSIONS[this.role] || [];
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Instance method to check permission
userSchema.methods.hasPermission = function(permission: string): boolean {
  return this.permissions.includes(permission);
};

// Instance method to get full name
userSchema.methods.getFullName = function(): string {
  return [this.firstName, this.lastName].filter(Boolean).join(' ') || this.email;
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Virtual for full name
userSchema.virtual('fullName').get(function(this: IUser) {
  return [this.firstName, this.lastName].filter(Boolean).join(' ') || this.email;
});

export const User = model<IUser>('User', userSchema);
