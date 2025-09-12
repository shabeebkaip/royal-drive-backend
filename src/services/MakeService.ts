import type { IMake, MakeListFilters } from '@/types/make';
import { MakeRepository } from '@/repositories/MakeRepository.js';

export class MakeService {
  constructor(private readonly repo: MakeRepository) {}

  async list(filters: MakeListFilters = {}, page = 1, limit = 10) {
    const filter: Record<string, any> = {};

    if (filters.active !== undefined) {
      filter.active = filters.active;
    }

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex }
      ];
    }

    return this.repo.findMany(filter, { 
      page, 
      limit, 
      sortBy: 'name', 
      sortOrder: 'asc' 
    });
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }

  async getBySlug(slug: string) {
    return this.repo.findBySlug(slug);
  }

  async getByName(name: string) {
    return this.repo.findByName(name);
  }

  async create(data: Partial<IMake>) {
    // Check if make with same name already exists
    const existing = await this.repo.findByName(data.name!);
    if (existing) {
      throw new Error('Make with this name already exists');
    }

    return this.repo.create(data);
  }

  async update(id: string, data: Partial<IMake>) {
    // If name is being updated, check for duplicates
    if (data.name) {
      const existing = await this.repo.findByName(data.name);
      if (existing && String(existing._id) !== id) {
        throw new Error('Make with this name already exists');
      }
    }

    return this.repo.update(id, data);
  }

  async remove(id: string) {
    // TODO: Check if make has associated vehicles before deletion
    // For now, just delete
    return this.repo.delete(id);
  }

  async updateStatus(id: string, active: boolean) {
    return this.repo.updateStatus(id, active);
  }

  async search(query: string, page = 1, limit = 10) {
    return this.repo.search(query, { page, limit });
  }

  async getActive(page = 1, limit = 10) {
    return this.repo.getActive({ page, limit });
  }

  async getPopular(limit = 10) {
    return this.repo.getPopular(limit);
  }

  async getStats() {
    // Get basic statistics
    const [total, active, inactive] = await Promise.all([
      this.repo.findMany({}, { page: 1, limit: 1 }).then(r => r.pagination.total),
      this.repo.findMany({ active: true } as any, { page: 1, limit: 1 }).then(r => r.pagination.total),
      this.repo.findMany({ active: false } as any, { page: 1, limit: 1 }).then(r => r.pagination.total)
    ]);

    return {
      total,
      active,
      inactive
    };
  }
}

export const makeService = new MakeService(new MakeRepository());
