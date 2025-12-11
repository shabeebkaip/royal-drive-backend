import type { IVehicleType, VehicleTypeListFilters } from '../types/vehicleType.js';
import { VehicleTypeRepository } from '@/repositories/VehicleTypeRepository';

export class VehicleTypeService {
  constructor(private readonly repo: VehicleTypeRepository) {}

  async list(filters: VehicleTypeListFilters = {}, page = 1, limit = 10) {
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

  async create(data: Partial<IVehicleType>) {
    // Check if vehicle type with same name already exists
    const existing = await this.repo.findByName(data.name!);
    if (existing) {
      throw new Error('Vehicle type with this name already exists');
    }

    return this.repo.create(data);
  }

  async update(id: string, data: Partial<IVehicleType>) {
    // If updating name, check for duplicates (excluding current record)
    if (data.name) {
      const existing = await this.repo.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new Error('Vehicle type with this name already exists');
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

export const vehicleTypeService = new VehicleTypeService(new VehicleTypeRepository());
