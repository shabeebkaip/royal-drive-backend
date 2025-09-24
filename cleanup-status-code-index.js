import mongoose from 'mongoose';

async function cleanupStatusCodeIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://royal-drive:RoyalDrive%40123%24@royal-drive.m95ponx.mongodb.net/royal-drive-dev');
    console.log('✅ Connected to MongoDB');

    // List all collections to see what exists
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name));

    // Find the status collection (could be 'status' or 'statuses')
    const statusCollectionName = collections.find(c => 
      c.name.toLowerCase().includes('status')
    )?.name;

    if (!statusCollectionName) {
      console.log('ℹ️  No status collection found');
      await mongoose.connection.close();
      return;
    }

    console.log(`🔍 Working with collection: ${statusCollectionName}`);
    const collection = mongoose.connection.db.collection(statusCollectionName);
    
    // List all indexes to see what exists
    const indexes = await collection.indexes();
    console.log('📋 Current Status indexes:', indexes.map(idx => ({ name: idx.name, key: idx.key })));

    // Drop the code index if it exists
    try {
      await collection.dropIndex('code_1');
      console.log('✅ Dropped code_1 index from status collection');
    } catch (error) {
      if (error.message.includes('index not found')) {
        console.log('ℹ️  code_1 index does not exist in status collection');
      } else {
        console.log('⚠️  Error dropping code_1 index from status collection:', error.message);
      }
    }

    // Also try to drop any other code-related indexes
    try {
      await collection.dropIndex({ code: 1 });
      console.log('✅ Dropped code unique index from status collection');
    } catch (error) {
      if (error.message.includes('index not found')) {
        console.log('ℹ️  code unique index does not exist in status collection');
      } else {
        console.log('⚠️  Error dropping code unique index from status collection:', error.message);
      }
    }

    // Remove code field from all existing status documents (if any)
    const updateResult = await collection.updateMany(
      {}, 
      { $unset: { code: "" } }
    );
    console.log(`✅ Removed code field from ${updateResult.modifiedCount} status documents`);

    // List indexes after cleanup
    const indexesAfter = await collection.indexes();
    console.log('📋 Status indexes after cleanup:', indexesAfter.map(idx => ({ name: idx.name, key: idx.key })));

    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanupStatusCodeIndex();
