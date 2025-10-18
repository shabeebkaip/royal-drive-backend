/**
 * Script to drop the stockNumber index from the vehicles collection
 * Run this before deleting all vehicles to clean up the database
 */

import mongoose from 'mongoose';
import { env } from '../src/config/env.js';

async function dropStockNumberIndex() {
  try {
    // Connect to MongoDB using the app's env config
    const mongoUri = env.MONGODB_URI;
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get the vehicles collection
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('vehicles');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Find and drop stockNumber index
    const stockNumberIndex = indexes.find(
      index => index.key && index.key['internal.stockNumber']
    );

    if (stockNumberIndex && stockNumberIndex.name) {
      console.log(`\n🗑️  Dropping index: ${stockNumberIndex.name}`);
      await collection.dropIndex(stockNumberIndex.name);
      console.log('✅ Successfully dropped stockNumber index');
    } else {
      console.log('\n⚠️  No stockNumber index found');
    }

    // Verify indexes after drop
    const newIndexes = await collection.indexes();
    console.log('\n📋 Remaining indexes:');
    newIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ Script completed successfully');
    console.log('You can now safely delete all vehicles from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
dropStockNumberIndex();
