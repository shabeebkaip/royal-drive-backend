/**
 * Database indexes for optimal vehicle query performance
 * Run this script to ensure all necessary indexes are created
 */

import { Vehicle } from '../models/vehicle.js';

export async function createVehicleIndexes() {
  console.log('Creating vehicle indexes for optimal performance...');

  try {
    // Slug index (already exists but ensure it's there)
    await Vehicle.collection.createIndex(
      { 'marketing.slug': 1 },
      { 
        unique: true, 
        partialFilterExpression: { 'marketing.slug': { $type: 'string' } },
        name: 'marketing_slug_unique'
      }
    );
    console.log('✓ Slug index created');

    // Compound index for filtering
    await Vehicle.collection.createIndex(
      { 
        make: 1, 
        model: 1, 
        year: -1, 
        status: 1 
      },
      { name: 'filtering_compound' }
    );
    console.log('✓ Filtering compound index created');

    // Index for price range queries
    await Vehicle.collection.createIndex(
      { 'pricing.listPrice': 1 },
      { name: 'price_filter' }
    );
    console.log('✓ Price filter index created');

    // Index for featured vehicles
    await Vehicle.collection.createIndex(
      { 'marketing.featured': 1, createdAt: -1 },
      { name: 'featured_vehicles' }
    );
    console.log('✓ Featured vehicles index created');

    // Index for status-based queries
    await Vehicle.collection.createIndex(
      { status: 1, createdAt: -1 },
      { name: 'status_filter' }
    );
    console.log('✓ Status filter index created');

    // Compound index for vehicle type and condition
    await Vehicle.collection.createIndex(
      { type: 1, condition: 1, year: -1 },
      { name: 'type_condition_filter' }
    );
    console.log('✓ Type and condition filter index created');

    // Index for VIN lookups
    await Vehicle.collection.createIndex(
      { vin: 1 },
      { 
        unique: true, 
        sparse: true,
        partialFilterExpression: { vin: { $type: 'string' } },
        name: 'vin_unique'
      }
    );
    console.log('✓ VIN index created');

    console.log('✅ All vehicle indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    throw error;
  }
}

// Export function to list all indexes
export async function listVehicleIndexes(): Promise<any> {
  const indexes = await Vehicle.collection.getIndexes();
  console.log('Current vehicle indexes:');
  console.log(JSON.stringify(indexes, null, 2));
  return indexes;
}
