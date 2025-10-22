/**
 * Script to create sales transactions for vehicles marked as "sold"
 * that don't have corresponding sales records
 */

import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { Vehicle } from '../src/models/vehicle.js';
import { SalesTransaction } from '../src/models/SalesTransaction.js';
import Status from '../src/models/status.js';
import { Make } from '../src/models/make.js';
import { Model } from '../src/models/model.js';

async function createSalesFromSoldVehicles() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Find the "sold" status
    const soldStatus = await Status.findOne({ name: /^sold$/i });
    
    if (!soldStatus) {
      console.log('❌ Could not find "sold" status in database');
      process.exit(1);
    }

    console.log(`✅ Found sold status: ${soldStatus._id}\n`);

    // Find all vehicles with sold status (without populate to avoid schema issues)
    const soldVehicles = await Vehicle.find({ status: soldStatus._id }).lean();

    console.log(`📊 Found ${soldVehicles.length} sold vehicles\n`);

    if (soldVehicles.length === 0) {
      console.log('✅ No sold vehicles found. Nothing to do.');
      process.exit(0);
    }

    // Check which vehicles already have sales transactions
    const vehicleIds = soldVehicles.map((v: any) => v._id);
    const existingSales = await SalesTransaction.find({
      vehicle: { $in: vehicleIds }
    }).lean();

    const vehiclesWithSales = new Set(
      existingSales.map((s: any) => s.vehicle.toString())
    );

    console.log(`📋 Found ${existingSales.length} existing sales transactions\n`);

    // Filter vehicles that don't have sales transactions
    const vehiclesNeedingSales = soldVehicles.filter(
      (v: any) => !vehiclesWithSales.has(v._id.toString())
    );

    console.log(`🔄 Creating sales transactions for ${vehiclesNeedingSales.length} vehicles...\n`);

    let created = 0;
    for (const vehicle of vehiclesNeedingSales) {
      const v: any = vehicle;
      
      // Create a sales transaction
      const salePrice = v.pricing?.listPrice || 0;
      const costOfGoods = v.internal?.acquisitionCost || 0;
      const margin = Math.max(0, salePrice - costOfGoods); // Ensure margin is not negative
      const taxRate = 0.13; // 13% HST for Ontario
      const grossPrice = salePrice;
      const taxAmount = +(grossPrice * taxRate).toFixed(2);
      const totalPrice = +(grossPrice + taxAmount).toFixed(2);

      const salesTransaction = new SalesTransaction({
        vehicle: v._id,
        customerName: 'Walk-in Customer', // Default for migrated data
        customerEmail: '',
        salePrice,
        currency: 'CAD',
        costOfGoods,
        margin,
        status: 'completed',
        paymentMethod: 'cash',
        discount: 0,
        taxRate,
        taxAmount,
        grossPrice,
        totalPrice,
        notes: `Auto-generated from sold vehicle (Year: ${v.year})`,
        closedAt: v.updatedAt || new Date()
      });

      await salesTransaction.save();
      created++;
      
      console.log(`  ✅ Created sale for: ${v.year} Vehicle ID ${v._id} - $${salePrice.toLocaleString()}`);
    }

    console.log(`\n✅ Successfully created ${created} sales transactions!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total sold vehicles: ${soldVehicles.length}`);
    console.log(`   - Existing sales: ${existingSales.length}`);
    console.log(`   - New sales created: ${created}`);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
createSalesFromSoldVehicles();
