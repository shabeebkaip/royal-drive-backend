import FuelType from '../models/fuelType';
import { IFuelType, FuelTypeListFilters } from '../types/fuelType';

export class FuelTypeRepository {
  // Find all fuel types with optional filters
  async findMany(
    filters: FuelTypeListFilters = {},
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    const query: any = {};
    
    // Apply filters
    if (filters.active !== undefined) {
      query.active = filters.active;
    }
    
    if (filters.search) {
      query.name = { $regex: filters.search, $options: 'i' };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination
    const [fuelTypes, total] = await Promise.all([
      FuelType.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate('vehicleCount')
        .lean(),
      FuelType.countDocuments(query)
    ]);

    return {
      fuelTypes,
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

  // Find fuel type by ID
  async findById(id: string): Promise<IFuelType | null> {
    return FuelType.findById(id).populate('vehicleCount');
  }

  // Find fuel type by slug
  async findBySlug(slug: string): Promise<IFuelType | null> {
    return FuelType.findOne({ slug }).populate('vehicleCount');
  }

  // Find active fuel types for dropdown
  async findActiveForDropdown(): Promise<Pick<IFuelType, '_id' | 'name' | 'slug'>[]> {
    return FuelType.find({ active: true })
      .select('_id name slug')
      .sort({ name: 1 })
      .lean();
  }

  // Create new fuel type
  async create(data: Partial<IFuelType>): Promise<IFuelType> {
    const fuelType = new FuelType(data);
    return fuelType.save();
  }

  // Update fuel type
  async update(id: string, data: Partial<IFuelType>): Promise<IFuelType | null> {
    return FuelType.findByIdAndUpdate(id, data, { 
      new: true, 
      runValidators: true 
    }).populate('vehicleCount');
  }

  // Update fuel type status
  async updateStatus(id: string, active: boolean): Promise<IFuelType | null> {
    return FuelType.findByIdAndUpdate(
      id, 
      { active, updatedAt: new Date() }, 
      { new: true }
    );
  }

  // Delete fuel type
  async delete(id: string): Promise<boolean> {
    const result = await FuelType.findByIdAndDelete(id);
    return !!result;
  }

  // Check if fuel type name exists
  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const query: any = { 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    };
    
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const count = await FuelType.countDocuments(query);
    return count > 0;
  }

  // Search fuel types
  async search(searchTerm: string): Promise<IFuelType[]> {
    return FuelType.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { slug: { $regex: searchTerm, $options: 'i' } }
      ],
      active: true
    })
    .sort({ name: 1 })
    .populate('vehicleCount')
    .lean();
  }

  // Get fuel type statistics
  async getStatistics() {
    const [total, active, inactive] = await Promise.all([
      FuelType.countDocuments({}),
      FuelType.countDocuments({ active: true }),
      FuelType.countDocuments({ active: false })
    ]);

    return {
      total,
      active,
      inactive
    };
  }

  // Get popular fuel types (with most vehicles)
  async getPopular(limit: number = 10): Promise<IFuelType[]> {
    return FuelType.find({ active: true })
      .populate('vehicleCount')
      .sort({ vehicleCount: -1 })
      .limit(limit)
      .lean();
  }
}
