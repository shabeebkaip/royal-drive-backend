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
        code: 'FWD',
        description: 'Engine power is transmitted to the front wheels only. Common in smaller cars and sedans for better fuel economy.',
        active: true
      },
      {
        name: 'Rear-Wheel Drive',
        code: 'RWD',
        description: 'Engine power is transmitted to the rear wheels only. Common in sports cars and trucks for better performance and handling.',
        active: true
      },
      {
        name: 'All-Wheel Drive',
        code: 'AWD',
        description: 'Power is automatically distributed to all wheels as needed. Provides better traction in various driving conditions.',
        active: true
      },
      {
        name: '4-Wheel Drive',
        code: '4WD',
        description: 'Power can be manually or automatically engaged to all wheels. Designed for off-road and challenging terrain.',
        active: true
      }
    ];

    const createdDriveTypes = await DriveType.insertMany(driveTypes);
    console.log(`✅ Created ${createdDriveTypes.length} drive types`);
    
    // Log the created drive types
    createdDriveTypes.forEach(driveType => {
      console.log(`   - ${driveType.name} (${driveType.code} - ${driveType.slug})`);
    });

  } catch (error) {
    console.error('❌ Error seeding drive types:', error);
    throw error;
  }
};
