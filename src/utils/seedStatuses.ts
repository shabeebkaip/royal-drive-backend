import Status from '@/models/status';

export const seedStatuses = async () => {
  try {
    // Check if statuses already exist
    const existingCount = await Status.countDocuments();
    if (existingCount > 0) {
      console.log('Statuses already seeded');
      return;
    }

    const statuses = [
      {
        name: 'Available',
        description: 'Vehicle is available for sale and can be purchased immediately',
        color: '#28a745',
        icon: '✅',
        isDefault: true,
        active: true
      },
      {
        name: 'Sold',
        description: 'Vehicle has been sold and is no longer available',
        color: '#dc3545',
        icon: '🚗',
        isDefault: false,
        active: true
      },
      {
        name: 'Pending',
        description: 'Vehicle sale is pending completion of paperwork or financing',
        color: '#ffc107',
        icon: '⏳',
        isDefault: false,
        active: true
      },
      {
        name: 'Reserved',
        description: 'Vehicle is reserved for a specific customer but not yet sold',
        color: '#fd7e14',
        icon: '🔒',
        isDefault: false,
        active: true
      },
      {
        name: 'On Hold',
        description: 'Vehicle is temporarily not available for sale',
        color: '#6c757d',
        icon: '⏸️',
        isDefault: false,
        active: true
      }
    ];

    const createdStatuses = await Status.insertMany(statuses);
    console.log(`✅ Created ${createdStatuses.length} statuses`);
    
    // Log the created statuses
    createdStatuses.forEach(status => {
      console.log(`   - ${status.name} (${status.slug}) ${status.isDefault ? '[DEFAULT]' : ''}`);
    });

  } catch (error) {
    console.error('❌ Error seeding statuses:', error);
    throw error;
  }
};
