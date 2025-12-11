import { VehicleType } from '../models/vehicleType.js';

export const seedVehicleTypes = async () => {
  try {
    // Check if vehicle types already exist
    const existingCount = await VehicleType.countDocuments();
    if (existingCount > 0) {
      console.log('Vehicle types already seeded');
      return;
    }

    const vehicleTypes = [
      {
        name: 'SUV',
        description: 'Sport Utility Vehicle - Perfect for families and outdoor adventures',
        active: true
      },
      {
        name: 'Sedan',
        description: 'Traditional four-door passenger car with separate trunk',
        active: true
      },
      {
        name: 'Hatchback',
        description: 'Compact car with rear door that swings upward to provide access to cargo area',
        active: true
      },
      {
        name: 'Coupe',
        description: 'Two-door car with fixed roof and sloping rear',
        active: true
      },
      {
        name: 'Convertible',
        description: 'Car with a roof structure that can be folded, detached, or retracted',
        active: true
      },
      {
        name: 'Truck',
        description: 'Motor vehicle designed primarily for the transportation of cargo',
        active: true
      },
      {
        name: 'Van',
        description: 'Type of road vehicle used for transporting goods or people',
        active: true
      },
      {
        name: 'Wagon',
        description: 'Car body style variant of a sedan with an extended rear cargo area',
        active: true
      },
      {
        name: 'Crossover',
        description: 'Vehicle built on a car platform but with higher ground clearance',
        active: true
      },
      {
        name: 'Luxury',
        description: 'High-end vehicles with premium features and comfort',
        active: true
      }
    ];

    const createdTypes = await VehicleType.insertMany(vehicleTypes);
    console.log(`✅ Created ${createdTypes.length} vehicle types`);
    
    // Log the created types
    createdTypes.forEach(type => {
      console.log(`   - ${type.name} (${type.slug})`);
    });

  } catch (error) {
    console.error('❌ Error seeding vehicle types:', error);
  }
};
