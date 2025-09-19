// Test script to verify FuelType model behavior
import mongoose from 'mongoose';
import FuelType from '../src/models/fuelType.js';

// Mock environment
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';

async function testFuelType() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Create a test fuel type
    const fuelType = new FuelType({
      name: 'Test Fuel',
      active: true
    });
    
    await fuelType.save();
    
    // Test JSON output
    const jsonOutput = fuelType.toJSON();
    console.log('JSON Output:', JSON.stringify(jsonOutput, null, 2));
    
    // Check if 'id' field exists
    console.log('Has id field:', 'id' in jsonOutput);
    console.log('Has _id field:', '_id' in jsonOutput);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

testFuelType();
