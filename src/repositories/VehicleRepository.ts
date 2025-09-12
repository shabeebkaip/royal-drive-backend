import { FilterQuery } from 'mongoose';
import '@/types/index.d';
import { Vehicle } from '@/models/vehicle.js';
import type { IVehicle } from '@/types/vehicle';


export class VehicleRepository implements IRepository<IVehicle> {
  async create(data: Partial<IVehicle>): Promise<IVehicle> {
    const doc = new Vehicle(data);
    return await doc.save();
  }

  async findById(id: string): Promise<IVehicle | null> {
    return Vehicle.findById(id)
      .populate('make', 'name slug logo')
      .select('-internal.acquisitionCost -internal.notes')
      .exec();
  }

  async findOne(filter: Partial<IVehicle>): Promise<IVehicle | null> {
    return Vehicle.findOne(filter as FilterQuery<IVehicle>)
      .populate('make', 'name slug logo')
      .select('-internal.acquisitionCost -internal.notes')
      .exec();
  }

  async findMany(
    filter: Partial<IVehicle> = {},
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IVehicle>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(100, options.limit ?? 10));
    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {};
    const sortBy = options.sortBy ?? 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    sort[sortBy] = sortOrder;

    const [data, total] = await Promise.all([
      Vehicle.find(filter as FilterQuery<IVehicle>)
        .populate('make', 'name slug logo')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-internal.acquisitionCost -internal.notes')
        .exec(),
      Vehicle.countDocuments(filter as FilterQuery<IVehicle>).exec(),
    ]);

    const pages = Math.ceil(total / limit) || 1;

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
    };
  }

  async update(id: string, data: Partial<IVehicle>): Promise<IVehicle | null> {
    return Vehicle.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .select('-internal.acquisitionCost -internal.notes')
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await Vehicle.findByIdAndDelete(id).exec();
    return !!result;
  }

  // Helpers specific to Vehicles
  async findByVinOrStock(idOrVinOrStock: string): Promise<IVehicle | null> {
    // Try by Mongo ID first implicitly in controllers; here VIN or stock
    const vin = idOrVinOrStock.toUpperCase();
    const byVin = await Vehicle.findOne({ vin })
      .select('-internal.acquisitionCost -internal.notes')
      .exec();
    if (byVin) return byVin;

    return Vehicle.findOne({ 'internal.stockNumber': idOrVinOrStock })
      .select('-internal.acquisitionCost -internal.notes')
      .exec();
  }

  async getFeatured(limit = 6): Promise<IVehicle[]> {
    return Vehicle.find({ 'marketing.featured': true, status: 'available' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-internal.acquisitionCost -internal.notes')
      .exec();
  }

  async search(
    q: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IVehicle>> {
    const searchRegex = new RegExp(q, 'i');
    const filter: FilterQuery<IVehicle> = {
      $or: [
        { make: searchRegex },
        { model: searchRegex },
        { 'marketing.keywords': { $in: [searchRegex] } },
        { 'marketing.description': searchRegex },
        { vin: searchRegex },
        { 'internal.stockNumber': searchRegex },
      ],
    } as any;

    return this.findMany(filter as any, { ...options, sortBy: 'createdAt', sortOrder: 'desc' });
  }

  async updateStatus(id: string, status: IVehicle['status']): Promise<IVehicle | null> {
    return Vehicle.findByIdAndUpdate(
      id,
      { status, 'availability.lastUpdated': new Date() },
      { new: true }
    )
      .select('_id status availability.lastUpdated')
      .exec();
  }
}

