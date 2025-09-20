import Transmission from '../models/transmission';
import { ITransmission, TransmissionListFilters } from '../types/transmission';

export class TransmissionRepository {
  // Get all transmissions with filtering and pagination
  static async getAll(filters: TransmissionListFilters) {
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

    // Calculate pagination
    const skip = (page - 1) * limit;
    const total = await Transmission.countDocuments(query);
    const pages = Math.ceil(total / limit);

    // Execute query
    const transmissions = await Transmission
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('vehicleCount');

    return {
      data: transmissions,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      }
    };
  }

  // Get active transmissions for dropdown
  static async getActiveForDropdown(): Promise<ITransmission[]> {
    return await Transmission
      .find({ active: true })
      .select('_id name slug')
      .sort({ name: 1 });
  }

  // Get transmission by ID
  static async getById(id: string): Promise<ITransmission | null> {
    return await Transmission.findById(id).populate('vehicleCount');
  }

  // Get transmission by slug
  static async getBySlug(slug: string): Promise<ITransmission | null> {
    return await Transmission.findOne({ slug }).populate('vehicleCount');
  }

  // Create new transmission
  static async create(data: Partial<ITransmission>): Promise<ITransmission> {
    const transmission = new Transmission(data);
    return await transmission.save();
  }

  // Update transmission
  static async update(id: string, data: Partial<ITransmission>): Promise<ITransmission | null> {
    return await Transmission.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('vehicleCount');
  }

  // Update transmission status
  static async updateStatus(id: string, active: boolean): Promise<ITransmission | null> {
    return await Transmission.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );
  }

  // Delete transmission
  static async delete(id: string): Promise<ITransmission | null> {
    return await Transmission.findByIdAndDelete(id);
  }

  // Check if transmission exists by name
  static async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const query: any = { 
      name: { $regex: `^${name}$`, $options: 'i' }
    };
    
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const count = await Transmission.countDocuments(query);
    return count > 0;
  }

  // Search transmissions
  static async search(searchTerm: string): Promise<ITransmission[]> {
    return await Transmission
      .find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } }
        ],
        active: true
      })
      .sort({ name: 1 })
      .limit(10);
  }

  // Get popular transmissions by vehicle count
  static async getPopular(): Promise<ITransmission[]> {
    return await Transmission
      .find({ active: true })
      .populate('vehicleCount')
      .sort({ vehicleCount: -1 })
      .limit(10);
  }

  // Get transmission statistics
  static async getStats(): Promise<any> {
    const total = await Transmission.countDocuments();
    const active = await Transmission.countDocuments({ active: true });
    const inactive = total - active;

    return {
      total,
      active,
      inactive
    };
  }
}
