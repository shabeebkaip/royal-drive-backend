import { FilterQuery } from 'mongoose';
import '@/types/index.d';
import { Model } from '@/models/model.js';
import type { IModel, ModelListFilters } from '@/types/model';

export class ModelRepository implements IRepository<IModel> {
  async create(data: Partial<IModel>): Promise<IModel> {
    const doc = new Model(data);
    return await doc.save();
  }

  async findById(id: string): Promise<IModel | null> {
    return Model.findById(id)
      .populate('make', 'name slug logo')
      .populate('vehicleType', 'name slug icon')
      .exec();
  }

  async findOne(filter: Partial<IModel>): Promise<IModel | null> {
    return Model.findOne(filter as FilterQuery<IModel>)
      .populate('make', 'name slug logo')
      .populate('vehicleType', 'name slug icon')
      .exec();
  }

  async findMany(
    filter: Partial<IModel> = {},
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IModel>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(100, options.limit ?? 10));
    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {};
    const sortBy = options.sortBy ?? 'name';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    sort[sortBy] = sortOrder;

    const [data, total] = await Promise.all([
      Model.find(filter as FilterQuery<IModel>)
        .populate('make', 'name slug logo')
        .populate('vehicleType', 'name slug icon')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      Model.countDocuments(filter as FilterQuery<IModel>).exec(),
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

  async update(id: string, data: Partial<IModel>): Promise<IModel | null> {
    return Model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .populate('make', 'name slug logo')
      .populate('vehicleType', 'name slug icon')
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await Model.findByIdAndDelete(id).exec();
    return !!result;
  }

  // Helper methods specific to Models
  async findBySlug(slug: string): Promise<IModel | null> {
    return Model.findOne({ slug })
      .populate('make', 'name slug logo')
      .populate('vehicleType', 'name slug icon')
      .exec();
  }

  async findByMake(makeId: string, options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<IModel>> {
    return this.findMany({ make: makeId } as any, options);
  }

  async findByVehicleType(vehicleTypeId: string, options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<IModel>> {
    return this.findMany({ vehicleType: vehicleTypeId } as any, options);
  }

  async findByMakeAndType(makeId: string, vehicleTypeId: string, options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<IModel>> {
    return this.findMany({ make: makeId, vehicleType: vehicleTypeId } as any, options);
  }

  async search(
    query: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IModel>> {
    const searchRegex = new RegExp(query, 'i');
    const filter: FilterQuery<IModel> = {
      $or: [
        { name: searchRegex },
        { description: searchRegex }
      ]
    };

    return this.findMany(filter as any, { ...options, sortBy: 'name', sortOrder: 'asc' });
  }

  async findActive(options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<IModel>> {
    return this.findMany({ active: true } as any, options);
  }

  async findActiveSimple(): Promise<Pick<IModel, '_id' | 'name' | 'slug' | 'make' | 'vehicleType'>[]> {
    return Model.find({ active: true })
      .select('_id name slug make vehicleType')
      .populate('make', 'name slug')
      .populate('vehicleType', 'name slug')
      .sort({ name: 1 })
      .exec() as any;
  }

  async getStats(): Promise<{ total: number; active: number; inactive: number }> {
    const [total, active] = await Promise.all([
      Model.countDocuments().exec(),
      Model.countDocuments({ active: true }).exec(),
    ]);

    return {
      total,
      active,
      inactive: total - active,
    };
  }

  async findPopular(limit = 10): Promise<IModel[]> {
    return Model.aggregate([
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: 'model',
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
        $lookup: {
          from: 'makes',
          localField: 'make',
          foreignField: '_id',
          as: 'make'
        }
      },
      {
        $lookup: {
          from: 'vehicletypes',
          localField: 'vehicleType',
          foreignField: '_id',
          as: 'vehicleType'
        }
      },
      {
        $unwind: '$make'
      },
      {
        $unwind: '$vehicleType'
      },
      {
        $project: {
          vehicles: 0
        }
      }
    ]).exec();
  }

  async checkUniqueness(name: string, makeId: string, excludeId?: string): Promise<boolean> {
    const filter: any = { name: new RegExp(`^${name}$`, 'i'), make: makeId };
    if (excludeId) {
      filter._id = { $ne: excludeId };
    }
    const existing = await Model.findOne(filter);
    return !existing;
  }
}

export const modelRepository = new ModelRepository();
