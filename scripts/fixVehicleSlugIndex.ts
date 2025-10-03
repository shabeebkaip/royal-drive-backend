import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

async function run() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db!;
  const collection = db.collection('vehicles');

    console.log('Connected. Checking indexes on vehicles...');
    const indexes = await collection.indexes();
    const slugIndex = indexes.find(i => i.name === 'marketing.slug_1');

    if (slugIndex) {
      console.log('Dropping existing index marketing.slug_1 ...');
      await collection.dropIndex('marketing.slug_1');
      console.log('Dropped old index');
    } else {
      console.log('No existing marketing.slug_1 index to drop');
    }

    // Clean documents where slug is explicitly null
    const unsetResult = await collection.updateMany(
      { 'marketing.slug': null },
      { $unset: { 'marketing.slug': '' } }
    );
    if (unsetResult.modifiedCount) {
      console.log(`Unset slug on ${unsetResult.modifiedCount} documents with null slug`);
    }

    console.log('Creating partial unique index on marketing.slug (strings only)...');
    await collection.createIndex(
      { 'marketing.slug': 1 },
      { unique: true, partialFilterExpression: { 'marketing.slug': { $type: 'string' } } }
    );
    console.log('Index created successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected');
  }
}

run();
