/**
 * One-time script to update vehicles to "sold" status for existing completed sales
 */

import mongoose from 'mongoose';
import { database } from '../config/database';
import { SalesTransaction } from '../models/SalesTransaction';
import { Vehicle } from '../models/vehicle';
import Status from '../models/status';

async function fixExistingSales() {
  await database.connect();
  console.log('Connected to DB');

  // Find the "sold" status ObjectId
  const soldStatus = await Status.findOne({ 
    $or: [
      { slug: 'sold' },
      { name: { $regex: /^sold$/i } }
    ]
  }).select('_id');

  if (!soldStatus) {
    console.error('No "sold" status found in Status collection. Please create one first.');
    await mongoose.disconnect();
    return;
  }

  console.log('Found sold status:', soldStatus._id);

  // Find all completed sales
  const completedSales = await SalesTransaction.find({ status: 'completed' })
    .populate('vehicle', 'status')
    .select('vehicle');

  console.log(`Found ${completedSales.length} completed sales`);

  let updated = 0;
  for (const sale of completedSales) {
    if (sale.vehicle && typeof sale.vehicle === 'object' && 'status' in sale.vehicle) {
      const vehicle = sale.vehicle as any;
      // Only update if not already sold
      if (!vehicle.status.equals(soldStatus._id)) {
        await Vehicle.updateOne({ _id: vehicle._id }, { $set: { status: soldStatus._id } });
        updated++;
        console.log(`Updated vehicle ${vehicle._id} to sold status`);
      }
    }
  }

  console.log(`Updated ${updated} vehicles to sold status`);
  await mongoose.disconnect();
}

fixExistingSales().catch(err => {
  console.error('Script failed:', err);
  mongoose.disconnect().finally(() => process.exit(1));
});
