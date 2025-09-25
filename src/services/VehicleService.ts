import type { IVehicle, VehicleListFilters } from '../types/vehicle.d';
import { VehicleRepository } from '../repositories/VehicleRepository';

export class VehicleService {
  constructor(private readonly repo: VehicleRepository) {}

  async list(filters: VehicleListFilters = {}, page = 1, limit = 10) {
  const filter: Record<string, any> = {};

  if (filters.make) filter.make = new RegExp(filters.make, 'i');
  if (filters.model) filter.model = new RegExp(filters.model, 'i');
    if (filters.year) filter.year = filters.year;
    if (filters.condition) filter.condition = filters.condition;
    if (filters.fuelType) filter['engine.fuelType'] = filters.fuelType;
    if (filters.transmission) filter['transmission.type'] = filters.transmission;
    if (filters.drivetrain) filter.drivetrain = filters.drivetrain;
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

  // Internal method that includes acquisition cost and sensitive data
  async getByIdInternal(id: string) {
    return this.repo.findByIdInternal(id);
  }

  create(data: Partial<IVehicle>) {
    return this.repo.create(data);
  }

  update(id: string, data: Partial<IVehicle>) {
    return this.repo.update(id, data);
  }

  // Internal update method that returns acquisition cost and sensitive data
  updateInternal(id: string, data: Partial<IVehicle>) {
    return this.repo.updateInternal(id, data);
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

  // listByDealership removed (no marketplace behavior)

  updateStatus(id: string, status: IVehicle['status']) {
    return this.repo.updateStatus(id, status);
  }
}

export const vehicleService = new VehicleService(new VehicleRepository());
