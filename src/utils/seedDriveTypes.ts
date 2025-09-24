import DriveType from '@/models/driveType';

export const seedDriveTypes = async () => {
  try {
    // Check if drive types already exist
    const existingCount = await DriveType.countDocuments();
    if (existingCount > 0) {
      console.log('Drive types already seeded');
      return;
    }

    const driveTypes = [
      {
        name: 'Front-Wheel Drive',
        active: true
      },
      {
        name: 'Rear-Wheel Drive',
        active: true
      },
      {
        name: 'All-Wheel Drive',
        active: true
      },
      {
        name: '4-Wheel Drive',
        active: true
      }
    ];

    const createdDriveTypes = await DriveType.insertMany(driveTypes);
    console.log(`✅ Created ${createdDriveTypes.length} drive types`);
    
    // Log the created drive types
    createdDriveTypes.forEach(driveType => {
      console.log(`   - ${driveType.name} (${driveType.slug})`);
    });

  } catch (error) {
    console.error('❌ Error seeding drive types:', error);
    throw error;
  }
};
