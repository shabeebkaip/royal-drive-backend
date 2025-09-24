const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['superAdmin', 'admin', 'manager', 'salesperson'],
    required: true,
    default: 'salesperson'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  permissions: [{
    type: String
  }],
  profile: {
    phone: String,
    avatar: String,
    department: String,
    hireDate: Date
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Role permissions
const USER_PERMISSIONS = {
  VEHICLES_VIEW: 'vehicles:view',
  VEHICLES_CREATE: 'vehicles:create',
  VEHICLES_UPDATE: 'vehicles:update',
  VEHICLES_DELETE: 'vehicles:delete',
  VEHICLES_VIEW_INTERNAL: 'vehicles:view:internal',
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_REPORTS: 'system:reports',
  MASTER_DATA_VIEW: 'masterdata:view',
  MASTER_DATA_MANAGE: 'masterdata:manage',
};

const ROLE_PERMISSIONS = {
  superAdmin: Object.values(USER_PERMISSIONS),
  admin: [
    USER_PERMISSIONS.VEHICLES_VIEW,
    USER_PERMISSIONS.VEHICLES_CREATE,
    USER_PERMISSIONS.VEHICLES_UPDATE,
    USER_PERMISSIONS.VEHICLES_DELETE,
    USER_PERMISSIONS.VEHICLES_VIEW_INTERNAL,
    USER_PERMISSIONS.USERS_VIEW,
    USER_PERMISSIONS.USERS_CREATE,
    USER_PERMISSIONS.USERS_UPDATE,
    USER_PERMISSIONS.SYSTEM_REPORTS,
    USER_PERMISSIONS.MASTER_DATA_VIEW,
    USER_PERMISSIONS.MASTER_DATA_MANAGE,
  ],
  manager: [
    USER_PERMISSIONS.VEHICLES_VIEW,
    USER_PERMISSIONS.VEHICLES_CREATE,
    USER_PERMISSIONS.VEHICLES_UPDATE,
    USER_PERMISSIONS.VEHICLES_VIEW_INTERNAL,
    USER_PERMISSIONS.USERS_VIEW,
    USER_PERMISSIONS.SYSTEM_REPORTS,
    USER_PERMISSIONS.MASTER_DATA_VIEW,
  ],
  salesperson: [
    USER_PERMISSIONS.VEHICLES_VIEW,
    USER_PERMISSIONS.VEHICLES_CREATE,
    USER_PERMISSIONS.VEHICLES_UPDATE,
    USER_PERMISSIONS.MASTER_DATA_VIEW,
  ],
};

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to set role-based permissions
userSchema.pre('save', function(next) {
  if (this.isModified('role') || this.isNew) {
    this.permissions = ROLE_PERMISSIONS[this.role] || [];
  }
  next();
});

const User = mongoose.model('User', userSchema);

async function createSuperAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to database');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ 
      email: 'royaldrivemotor@gmail.com' 
    });

    if (existingSuperAdmin) {
      console.log('✅ Super admin already exists!');
      console.log('📧 Email:', existingSuperAdmin.email);
      console.log('👤 Role:', existingSuperAdmin.role);
      console.log('📊 Status:', existingSuperAdmin.status);
      console.log('🔑 Permissions:', existingSuperAdmin.permissions.length, 'assigned');
      return;
    }

    // Create super admin user
    const superAdmin = new User({
      email: 'royaldrivemotor@gmail.com',
      password: 'RoyalDrive@123#',
      firstName: 'Royal',
      lastName: 'Admin',
      role: 'superAdmin',
      status: 'active',
      profile: {
        department: 'Administration',
        hireDate: new Date()
      }
    });

    await superAdmin.save();

    console.log('✅ Super Admin created successfully!');
    console.log('📧 Email: royaldrivemotor@gmail.com');
    console.log('🔑 Password: RoyalDrive@123#');
    console.log('👤 Role: superAdmin');
    console.log('📋 Permissions:', superAdmin.permissions.length, 'permissions assigned');
    console.log('\n🚨 IMPORTANT: Please change the password after first login for security!');
    console.log('\n🔗 Login endpoint: POST /api/v1/auth/login');
    console.log('📝 Body: { "email": "royaldrivemotor@gmail.com", "password": "RoyalDrive@123#" }');

  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
}

// Run the script
createSuperAdmin().catch(console.error);
