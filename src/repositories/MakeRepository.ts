import { FilterQuery } from 'mongoose';
import '@/types/index.d';
import { Make } from '@/models/make.js';
import type { IMake, MakeListFilters } from '@/types/make';

export class MakeRepository implements IRepository<IMake> {
  async create(data: Partial<IMake>): Promise<IMake> {
    const doc = new Make(data);
    return await doc.save();
  }

  async findById(id: string): Promise<IMake | null> {
    return Make.findById(id).exec();
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

    const [data, total] = await Promise.all([
      Make.find(filter as FilterQuery<IMake>)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      Make.countDocuments(filter as FilterQuery<IMake>).exec(),
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
    return Make.findOne({ slug }).exec();
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
    // This would typically join with Vehicle collection to get actual counts
    // For now, return active makes sorted by name
    return Make.find({ active: true })
      .sort({ name: 1 })
      .limit(limit)
      .exec();
  }
}

export const makeRepository = new MakeRepository();
