import DriveType from '../models/driveType.js';
import { IDriveType, DriveTypeListFilters } from '../types/driveType.js';

export class DriveTypeRepository {
  // Get all drive types with filtering and pagination
  async findAll(filters: DriveTypeListFilters = {}): Promise<PaginatedResult<IDriveType>> {
    const { 
      search, 
      active, 
      sortBy = 'name', 
      sortOrder = 'asc', 
      page = 1, 
      limit = 10 
    } = filters;

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (active !== undefined) {
      query.active = active;
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [driveTypes, total] = await Promise.all([
      DriveType.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('vehicleCount')
        .lean(),
      DriveType.countDocuments(query)
    ]);

    return {
      data: driveTypes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  // Get drive type by ID
  async findById(id: string): Promise<IDriveType | null> {
    return DriveType.findById(id).populate('vehicleCount').lean();
  }

  // Get drive type by slug
  async findBySlug(slug: string): Promise<IDriveType | null> {
    return DriveType.findOne({ slug }).populate('vehicleCount').lean();
  }

  // Create new drive type
  async create(driveTypeData: Partial<IDriveType>): Promise<IDriveType> {
    const driveType = new DriveType(driveTypeData);
    return driveType.save();
  }

  // Update drive type
  async update(id: string, driveTypeData: Partial<IDriveType>): Promise<IDriveType | null> {
    return DriveType.findByIdAndUpdate(
      id, 
      { ...driveTypeData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    ).populate('vehicleCount').lean();
  }

  // Delete drive type
  async delete(id: string): Promise<IDriveType | null> {
    return DriveType.findByIdAndDelete(id).lean();
  }

  // Check if drive type exists by name
  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const query: any = { 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    };
    
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const count = await DriveType.countDocuments(query);
    return count > 0;
  }

  // Search drive types
  async search(query: string, options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<IDriveType>> {
    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } }
      ]
    };

    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [driveTypes, total] = await Promise.all([
      DriveType.find(searchQuery)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .populate('vehicleCount')
        .lean(),
      DriveType.countDocuments(searchQuery)
    ]);

    return {
      data: driveTypes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  // Get active drive types
  async findActive(options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<IDriveType>> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [driveTypes, total] = await Promise.all([
      DriveType.find({ active: true })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .populate('vehicleCount')
        .lean(),
      DriveType.countDocuments({ active: true })
    ]);

    return {
      data: driveTypes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  // Get active drive types for dropdown (simple format)
  async findActiveSimple(): Promise<Pick<IDriveType, '_id' | 'name' | 'slug'>[]> {
    return DriveType.find({ active: true })
      .select('_id name slug')
      .sort({ name: 1 })
      .lean();
  }

  // Get drive type stats
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    mostUsed?: { name: string; vehicleCount: number };
  }> {
    const [total, active, driveTypesWithCounts] = await Promise.all([
      DriveType.countDocuments(),
      DriveType.countDocuments({ active: true }),
      DriveType.aggregate([
        {
          $lookup: {
            from: 'vehicles',
            localField: '_id',
            foreignField: 'drivetrain',
            as: 'vehicles'
          }
        },
        {
          $addFields: {
            vehicleCount: { $size: '$vehicles' }
          }
        },
        {
          $sort: { vehicleCount: -1 }
        },
        {
          $limit: 1
        },
        {
          $project: {
            name: 1,
            vehicleCount: 1
          }
        }
      ])
    ]);

    const inactive = total - active;
    const mostUsed = driveTypesWithCounts.length > 0 ? driveTypesWithCounts[0] : undefined;

    return {
      total,
      active,
      inactive,
      mostUsed
    };
  }

  // Bulk update status
  async bulkUpdateStatus(ids: string[], active: boolean): Promise<number> {
    const result = await DriveType.updateMany(
      { _id: { $in: ids } },
      { active, updatedAt: new Date() }
    );
    return result.modifiedCount;
  }
}
