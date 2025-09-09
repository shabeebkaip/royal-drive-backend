import type { IVehicle } from '@/types/vehicle';
import { vehicleRepository, VehicleRepository } from '@/repositories/VehicleRepository.js';

export interface VehicleListFilters {
  make?: string;
  model?: string;
  year?: number;
  minYear?: number;
  maxYear?: number;
  condition?: IVehicle['condition'];
  bodyType?: IVehicle['bodyType'];
  fuelType?: IVehicle['engine']['fuelType'];
  status?: IVehicle['status'];
  minPrice?: number;
  maxPrice?: number;
}

export class VehicleService {
  constructor(private readonly repo: VehicleRepository) {}

  async list(filters: VehicleListFilters = {}, page = 1, limit = 10) {
  const filter: Record<string, any> = {};

  if (filters.make) filter.make = new RegExp(filters.make, 'i');
  if (filters.model) filter.model = new RegExp(filters.model, 'i');
    if (filters.year) filter.year = filters.year;
    if (filters.condition) filter.condition = filters.condition;
    if (filters.bodyType) filter.bodyType = filters.bodyType;
    if (filters.fuelType) filter['engine.fuelType'] = filters.fuelType;
    if (filters.status) filter.status = filters.status;

    if (filters.minPrice || filters.maxPrice) {
      filter['pricing.listPrice'] = {};
      if (filters.minPrice) filter['pricing.listPrice'].$gte = filters.minPrice;
      if (filters.maxPrice) filter['pricing.listPrice'].$lte = filters.maxPrice;
    }

    if (filters.minYear || filters.maxYear) {
      filter.year = {} as any;
      if (filters.minYear) (filter.year as any).$gte = filters.minYear;
      if (filters.maxYear) (filter.year as any).$lte = filters.maxYear;
    }

    return this.repo.findMany(filter, { page, limit, sortBy: 'createdAt', sortOrder: 'desc' });
  }

  getByIdOrAlt(idOrVinOrStock: string) {
    // Controller first tries id; service will attempt the alternative lookups
    return this.repo.findByVinOrStock(idOrVinOrStock);
  }

  async getById(id: string) {
    return this.repo.findById(id);
  }

  create(data: Partial<IVehicle>) {
    return this.repo.create({
      ...data,
      location: {
        ...(data.location as any),
        dealershipName: 'Royal Drive Canada',
      } as any,
    });
  }

  update(id: string, data: Partial<IVehicle>) {
    if (data.location && (data.location as any).dealershipName) {
      (data.location as any).dealershipName = 'Royal Drive Canada';
    }
    return this.repo.update(id, data);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }

  getFeatured(limit = 6) {
    return this.repo.getFeatured(limit);
  }

  search(q: string, page = 1, limit = 10) {
    return this.repo.search(q, { page, limit });
  }

  listByDealership(name: string, page = 1, limit = 10) {
    return this.repo.findByDealership(name, { page, limit });
  }

  updateStatus(id: string, status: IVehicle['status']) {
    return this.repo.updateStatus(id, status);
  }
}

export const vehicleService = new VehicleService(vehicleRepository);
