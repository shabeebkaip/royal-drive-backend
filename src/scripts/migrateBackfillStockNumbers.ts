/**
 * Migration: Backfill missing internal.stockNumber values and recreate partial unique index.
 *
 * Steps:
 * 1. Connect to DB using existing config.
 * 2. Find vehicles where internal.stockNumber is null or missing.
 * 3. For each, generate a new stock number (using existing generator) and update.
 * 4. Drop existing full unique index on internal.stockNumber if present.
 * 5. Create partial unique index enforcing uniqueness only when stockNumber is a string.
 * 6. Summary output.
 *
 * Safe to re-run: will skip vehicles that already have stock numbers.
 */

import mongoose from 'mongoose';
import { database } from '../config/database';
import { Vehicle } from '../models/vehicle';
import { generateStockNumber } from '../utils/generateStockNumber';
import { env } from '../config/env';

async function ensurePartialIndex() {
  const collection = mongoose.connection.collection('vehicles');
  const indexes = await collection.indexes();
  const targetName = indexes.find(i => i.key && i.key['internal.stockNumber']);

  // Drop any existing index named on internal.stockNumber that isn't partial
  if (targetName && !targetName.partialFilterExpression) {
    if (targetName.name) {
      console.log('Dropping existing non-partial stockNumber index:', targetName.name);
      await collection.dropIndex(targetName.name);
    } else {
      console.log('Dropping existing non-partial stockNumber index by key spec');
      try { await collection.dropIndex({ 'internal.stockNumber': 1 } as any); } catch (e) { console.warn('Drop by key failed:', (e as Error).message); }
    }
  }

  // Create partial unique index
  console.log('Creating partial unique index on internal.stockNumber');
  await collection.createIndex(
    { 'internal.stockNumber': 1 },
    { unique: true, partialFilterExpression: { 'internal.stockNumber': { $type: 'string' } } }
  );
}

async function backfill() {
  await database.connect();
  console.log('Connected to DB host:', env.MONGODB_URI.split('@').pop());

  const cursor = Vehicle.find({ $or: [ { 'internal.stockNumber': null }, { 'internal.stockNumber': { $exists: false } } ] })
    .select('_id internal.stockNumber')
    .cursor();

  let processed = 0;
  for await (const doc of cursor) {
    const stock = await generateStockNumber();
    await Vehicle.updateOne({ _id: doc._id }, { $set: { 'internal.stockNumber': stock } });
    processed++;
    if (processed % 50 === 0) console.log('Processed', processed);
  }

  console.log('Backfill complete. Vehicles updated:', processed);

  await ensurePartialIndex();

  console.log('Migration finished.');
  await mongoose.disconnect();
}

backfill().catch(err => {
  console.error('Migration failed:', err);
  mongoose.disconnect().finally(() => process.exit(1));
});
