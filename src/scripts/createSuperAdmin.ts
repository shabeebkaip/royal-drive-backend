#!/usr/bin/env node
import { database } from '../config/database.js';
import { User } from '../models/User';
import { env } from '../config/env.js';

async function createSuperAdmin() {
  try {
    // Connect to database
    await database.connect();
    console.log('Connected to database');

    // Check if super admin already exists
    const existingSuperAdmin = await User.findOne({ 
      email: 'royaldrivemotor@gmail.com' 
    }).exec();

    if (existingSuperAdmin) {
      console.log('Super admin already exists!');
      console.log('Email:', existingSuperAdmin.email);
      console.log('Role:', existingSuperAdmin.role);
      console.log('Status:', existingSuperAdmin.status);
      process.exit(0);
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
    console.log('\n🚨 Please change the password after first login for security!');

  } catch (error) {
    console.error('❌ Error creating super admin:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  createSuperAdmin();
}

export { createSuperAdmin };
