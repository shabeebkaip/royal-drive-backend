import Status from '@/models/status';
import { IStatus, StatusListFilters } from '@/types/status';

export class StatusRepository {
  // Get all statuses with filtering and pagination
  async findAll(filters: StatusListFilters = {}) {
    const { 
      search, 
      active, 
      isDefault,
      sortBy = 'name', 
      sortOrder = 'asc', 
      page = 1, 
      limit = 10 
    } = filters;

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (active !== undefined) {
      query.active = active;
    }

    if (isDefault !== undefined) {
      query.isDefault = isDefault;
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const [statuses, total] = await Promise.all([
      Status.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('vehicleCount')
        .lean(),
      Status.countDocuments(query)
    ]);

    return {
      data: statuses,
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

  // Get status by ID
  async findById(id: string): Promise<IStatus | null> {
    return Status.findById(id).populate('vehicleCount').lean();
  }

  // Get status by slug
  async findBySlug(slug: string): Promise<IStatus | null> {
    return Status.findOne({ slug }).populate('vehicleCount').lean();
  }

  // Get status by code
  async findByCode(code: string): Promise<IStatus | null> {
    return Status.findOne({ code: code.toLowerCase() }).populate('vehicleCount').lean();
  }

  // Get default status
  async findDefault(): Promise<IStatus | null> {
    return Status.findOne({ isDefault: true, active: true }).lean();
  }

  // Create new status
  async create(statusData: Partial<IStatus>): Promise<IStatus> {
    const status = new Status(statusData);
    return status.save();
  }

  // Update status
  async update(id: string, statusData: Partial<IStatus>): Promise<IStatus | null> {
    return Status.findByIdAndUpdate(
      id, 
      { ...statusData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    ).populate('vehicleCount').lean();
  }

  // Delete status
  async delete(id: string): Promise<IStatus | null> {
    return Status.findByIdAndDelete(id).lean();
  }

  // Check if status exists by name
  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const query: any = { 
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    };
    
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const count = await Status.countDocuments(query);
    return count > 0;
  }

  // Check if status exists by code
  async existsByCode(code: string, excludeId?: string): Promise<boolean> {
    const query: any = { 
      code: code.toLowerCase()
    };
    
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const count = await Status.countDocuments(query);
    return count > 0;
  }

  // Search statuses
  async search(query: string, options: PaginationOptions = { page: 1, limit: 10 }) {
    const searchQuery = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    };

    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [statuses, total] = await Promise.all([
      Status.find(searchQuery)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .populate('vehicleCount')
        .lean(),
      Status.countDocuments(searchQuery)
    ]);

    return {
      data: statuses,
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

  // Get active statuses
  async findActive(options: PaginationOptions = { page: 1, limit: 10 }) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [statuses, total] = await Promise.all([
      Status.find({ active: true })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .populate('vehicleCount')
        .lean(),
      Status.countDocuments({ active: true })
    ]);

    return {
      data: statuses,
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

  // Get active statuses for dropdown (simple format)
  async findActiveSimple(): Promise<Pick<IStatus, '_id' | 'name' | 'code' | 'slug' | 'color' | 'icon'>[]> {
    return Status.find({ active: true })
      .select('_id name code slug color icon')
      .sort({ name: 1 })
      .lean();
  }

  // Get status stats
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    defaultStatus?: { name: string; code: string };
    mostUsed?: { name: string; vehicleCount: number };
  }> {
    const [total, active, defaultStatus, statusesWithCounts] = await Promise.all([
      Status.countDocuments(),
      Status.countDocuments({ active: true }),
      Status.findOne({ isDefault: true }).select('name code').lean(),
      Status.aggregate([
        {
          $lookup: {
            from: 'vehicles',
            localField: 'code',
            foreignField: 'status',
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
    const mostUsed = statusesWithCounts.length > 0 ? statusesWithCounts[0] : undefined;

    const result: {
      total: number;
      active: number;
      inactive: number;
      defaultStatus?: { name: string; code: string };
      mostUsed?: { name: string; vehicleCount: number };
    } = {
      total,
      active,
      inactive
    };

    if (defaultStatus) {
      result.defaultStatus = { name: defaultStatus.name, code: defaultStatus.code };
    }

    if (mostUsed) {
      result.mostUsed = mostUsed;
    }

    return result;
  }

  // Bulk update status
  async bulkUpdateStatus(ids: string[], active: boolean): Promise<number> {
    const result = await Status.updateMany(
      { _id: { $in: ids } },
      { active, updatedAt: new Date() }
    );
    return result.modifiedCount;
  }

  // Set default status
  async setDefault(id: string): Promise<IStatus | null> {
    // First, remove default from all other statuses
    await Status.updateMany(
      { _id: { $ne: id } },
      { isDefault: false }
    );
    
    // Then set the new default
    return Status.findByIdAndUpdate(
      id,
      { isDefault: true, active: true, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
  }
}
