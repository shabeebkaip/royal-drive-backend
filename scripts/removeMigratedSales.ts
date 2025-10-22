/**
 * Script to remove the 2 sales transactions created by the migration script
 * and unmark the corresponding vehicles as sold
 */

import mongoose from 'mongoose';
import { env } from '../src/config/env.js';
import { Vehicle } from '../src/models/vehicle.js';
import { SalesTransaction } from '../src/models/SalesTransaction.js';

async function removeMigratedSales() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // The two vehicle IDs from the migration
    const vehicleIdsToClean = [
      '68f7bfcf25b647b5d716172d', // 2009 vehicle - $6,125
      '68f7c62925b647b5d716176d'  // 2024 vehicle - $29,900
    ];

    console.log(`🔍 Looking for sales transactions for these vehicles...\n`);

    // Find and delete the sales transactions
    const deletedSales = await SalesTransaction.deleteMany({
      vehicle: { $in: vehicleIdsToClean.map(id => new mongoose.Types.ObjectId(id)) }
    });

    console.log(`✅ Deleted ${deletedSales.deletedCount} sales transactions\n`);

    // Optional: Update the vehicles to remove sold status if needed
    // Uncomment the following if you want to change their status back
    /*
    console.log(`🔄 Updating vehicle statuses...\n`);
    
    const availableStatus = await Status.findOne({ name: /^available$/i });
    
    if (availableStatus) {
      const updatedVehicles = await Vehicle.updateMany(
        { _id: { $in: vehicleIdsToClean.map(id => new mongoose.Types.ObjectId(id)) } },
        { $set: { status: availableStatus._id } }
      );
      console.log(`✅ Updated ${updatedVehicles.modifiedCount} vehicles\n`);
    }
    */

    console.log(`📊 Summary:`);
    console.log(`   - Sales deleted: ${deletedSales.deletedCount}`);
    console.log(`   - Vehicle IDs affected: ${vehicleIdsToClean.length}`);
    
    console.log('\n✅ Cleanup completed successfully!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    console.log('\n🔌 Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

// Run the script
removeMigratedSales();
