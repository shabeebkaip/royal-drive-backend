import { FilterQuery } from 'mongoose';
import { VehicleType } from '../models/vehicleType';
import type { IVehicleType, VehicleTypeListFilters } from '../types/vehicleType';

export class VehicleTypeRepository implements IRepository<IVehicleType> {
  async create(data: Partial<IVehicleType>): Promise<IVehicleType> {
    const doc = new VehicleType(data);
    return await doc.save();
  }

  async findById(id: string): Promise<IVehicleType | null> {
    return VehicleType.findById(id).exec();
  }

  async findOne(filter: Partial<IVehicleType>): Promise<IVehicleType | null> {
    return VehicleType.findOne(filter as FilterQuery<IVehicleType>).exec();
  }

  async findMany(
    filter: Partial<IVehicleType> = {},
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IVehicleType>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(100, options.limit ?? 10));
    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {};
    const sortBy = options.sortBy ?? 'name';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    sort[sortBy] = sortOrder;

    const [data, total] = await Promise.all([
      VehicleType.find(filter as FilterQuery<IVehicleType>)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      VehicleType.countDocuments(filter as FilterQuery<IVehicleType>).exec(),
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

  async update(id: string, data: Partial<IVehicleType>): Promise<IVehicleType | null> {
    return VehicleType.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await VehicleType.findByIdAndDelete(id).exec();
    return !!result;
  }

  // Helper methods specific to VehicleTypes
  async findBySlug(slug: string): Promise<IVehicleType | null> {
    return VehicleType.findOne({ slug }).exec();
  }

  async findByName(name: string): Promise<IVehicleType | null> {
    return VehicleType.findOne({ name: new RegExp(`^${name}$`, 'i') }).exec();
  }

  async search(
    query: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IVehicleType>> {
    const searchRegex = new RegExp(query, 'i');
    const filter: FilterQuery<IVehicleType> = {
      $or: [
        { name: searchRegex },
        { description: searchRegex }
      ]
    };

    return this.findMany(filter as any, { ...options, sortBy: 'name', sortOrder: 'asc' });
  }

  async findActive(options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<IVehicleType>> {
    return this.findMany({ active: true } as any, options);
  }

  async findActiveSimple(): Promise<Pick<IVehicleType, '_id' | 'name' | 'slug' | 'icon'>[]> {
    return VehicleType.find({ active: true })
      .select('_id name slug icon')
      .sort({ name: 1 })
      .exec() as any;
  }

  async getStats(): Promise<{ total: number; active: number; inactive: number }> {
    const [total, active] = await Promise.all([
      VehicleType.countDocuments().exec(),
      VehicleType.countDocuments({ active: true }).exec(),
    ]);

    return {
      total,
      active,
      inactive: total - active,
    };
  }

  async findPopular(limit = 10): Promise<IVehicleType[]> {
    return VehicleType.aggregate([
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: 'type',
          as: 'vehicles'
        }
      },
      {
        $addFields: {
          vehicleCount: { $size: '$vehicles' }
        }
      },
      {
        $sort: { vehicleCount: -1, name: 1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          vehicles: 0
        }
      }
    ]).exec();
  }
}

export const vehicleTypeRepository = new VehicleTypeRepository();
