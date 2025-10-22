import { FilterQuery, Types } from 'mongoose';
import { Make } from '../models/make';
import type { IMake } from '../types/make';

export class MakeRepository implements IRepository<IMake> {
  async create(data: Partial<IMake>): Promise<IMake> {
    const doc = new Make(data);
    return await doc.save();
  }

  async findById(id: string): Promise<IMake | null> {
    
    const pipeline: any[] = [
      { $match: { _id: new Types.ObjectId(id) } },
      // Lookup vehicles for this make
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: 'make',
          as: 'vehicles'
        }
      },
      // Add vehicleCount field
      {
        $addFields: {
          vehicleCount: { $size: '$vehicles' }
        }
      },
      // Remove vehicles array
      {
        $project: {
          vehicles: 0
        }
      }
    ];

    const result = await Make.aggregate(pipeline).exec();
    return result.length > 0 ? result[0] : null;
  }

  async findOne(filter: Partial<IMake>): Promise<IMake | null> {
    return Make.findOne(filter as FilterQuery<IMake>).exec();
  }

  async findMany(
    filter: Partial<IMake> = {},
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IMake>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(100, options.limit ?? 10));
    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {};
    const sortBy = options.sortBy ?? 'name';
    const sortOrder = options.sortOrder === 'desc' ? -1 : 1;
    sort[sortBy] = sortOrder;

    // Build aggregation pipeline to include vehicle count
    const matchStage: any = {};
    Object.entries(filter).forEach(([key, value]) => {
      if (value !== undefined) {
        matchStage[key] = value;
      }
    });

    const pipeline: any[] = [
      { $match: matchStage },
      // Lookup vehicles for this make
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: 'make',
          as: 'vehicles'
        }
      },
      // Add vehicleCount field
      {
        $addFields: {
          vehicleCount: { $size: '$vehicles' }
        }
      },
      // Remove vehicles array
      {
        $project: {
          vehicles: 0
        }
      },
      // Sort
      { $sort: sort },
      // Facet for pagination
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: 'count' }
          ]
        }
      }
    ];

    const [result] = await Make.aggregate(pipeline).exec();
    
    const data = result.data || [];
    const total = result.totalCount[0]?.count || 0;
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

  async update(id: string, data: Partial<IMake>): Promise<IMake | null> {
    return Make.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await Make.findByIdAndDelete(id).exec();
    return !!result;
  }

  // Helper methods specific to Makes
  async findBySlug(slug: string): Promise<IMake | null> {
    const pipeline: any[] = [
      { $match: { slug } },
      // Lookup vehicles for this make
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: 'make',
          as: 'vehicles'
        }
      },
      // Add vehicleCount field
      {
        $addFields: {
          vehicleCount: { $size: '$vehicles' }
        }
      },
      // Remove vehicles array
      {
        $project: {
          vehicles: 0
        }
      }
    ];

    const result = await Make.aggregate(pipeline).exec();
    return result.length > 0 ? result[0] : null;
  }

  async findByName(name: string): Promise<IMake | null> {
    return Make.findOne({ name: new RegExp(`^${name}$`, 'i') }).exec();
  }

  async search(
    query: string,
    options: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResult<IMake>> {
    const searchRegex = new RegExp(query, 'i');
    const filter: FilterQuery<IMake> = {
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { country: searchRegex }
      ],
    };

    return this.findMany(filter as any, options);
  }

  async getActive(options: PaginationOptions = { page: 1, limit: 10 }): Promise<PaginatedResult<IMake>> {
    return this.findMany({ active: true } as any, options);
  }

  async updateStatus(id: string, active: boolean): Promise<IMake | null> {
    return Make.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    ).exec();
  }

  async getPopular(limit = 10): Promise<IMake[]> {
    // Get makes with vehicle count, sorted by vehicle count descending
    const pipeline: any[] = [
      { $match: { active: true } },
      // Lookup vehicles for this make
      {
        $lookup: {
          from: 'vehicles',
          localField: '_id',
          foreignField: 'make',
          as: 'vehicles'
        }
      },
      // Add vehicleCount field
      {
        $addFields: {
          vehicleCount: { $size: '$vehicles' }
        }
      },
      // Remove vehicles array
      {
        $project: {
          vehicles: 0
        }
      },
      // Sort by vehicle count descending (most popular first)
      { $sort: { vehicleCount: -1, name: 1 } },
      // Limit results
      { $limit: limit }
    ];

    return Make.aggregate(pipeline).exec();
  }
}

export const makeRepository = new MakeRepository();
