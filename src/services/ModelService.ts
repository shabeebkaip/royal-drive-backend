import type { IModel, ModelListFilters } from '@/types/model';
import { ModelRepository } from '@/repositories/ModelRepository.js';

export class ModelService {
  constructor(private readonly repo: ModelRepository) {}

  async list(filters: ModelListFilters = {}, page = 1, limit = 10) {
    const filter: Record<string, any> = {};

    if (filters.active !== undefined) {
      filter.active = filters.active;
    }

    if (filters.make) {
      filter.make = filters.make;
    }

    if (filters.vehicleType) {
      filter.vehicleType = filters.vehicleType;
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

  async getByMake(makeId: string, page = 1, limit = 10) {
    return this.repo.findByMake(makeId, { page, limit });
  }

  async getByVehicleType(vehicleTypeId: string, page = 1, limit = 10) {
    return this.repo.findByVehicleType(vehicleTypeId, { page, limit });
  }

  async getByMakeAndType(makeId: string, vehicleTypeId: string, page = 1, limit = 10) {
    return this.repo.findByMakeAndType(makeId, vehicleTypeId, { page, limit });
  }

  async create(data: Partial<IModel>) {
    // Check if model with same name and make already exists
    const isUnique = await this.repo.checkUniqueness(data.name!, data.make!.toString());
    if (!isUnique) {
      throw new Error('Model with this name already exists for this make');
    }

    return this.repo.create(data);
  }

  async update(id: string, data: Partial<IModel>) {
    // If updating name or make, check for duplicates (excluding current record)
    if (data.name || data.make) {
      const existing = await this.repo.findById(id);
      if (!existing) {
        throw new Error('Model not found');
      }

      const nameToCheck = data.name || existing.name;
      const makeToCheck = data.make || existing.make;
      
      const isUnique = await this.repo.checkUniqueness(nameToCheck, makeToCheck.toString(), id);
      if (!isUnique) {
        throw new Error('Model with this name already exists for this make');
      }
    }

    return this.repo.update(id, data);
  }

  async remove(id: string) {
    return this.repo.delete(id);
  }

  async updateStatus(id: string, active: boolean) {
    return this.repo.update(id, { active });
  }

  async search(query: string, page = 1, limit = 10) {
    return this.repo.search(query, { page, limit });
  }

  async getActive(page = 1, limit = 10) {
    return this.repo.findActive({ page, limit });
  }

  async getPopular(limit = 10) {
    return this.repo.findPopular(limit);
  }

  async getStats() {
    return this.repo.getStats();
  }

  async getDropdown() {
    return this.repo.findActiveSimple();
  }
}

export const modelService = new ModelService(new ModelRepository());
