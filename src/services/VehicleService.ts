import type { IVehicle, VehicleListFilters } from '../types/vehicle.d';
import { VehicleRepository } from '../repositories/VehicleRepository';

export class VehicleService {
  constructor(private readonly repo: VehicleRepository) {}

  async list(filters: VehicleListFilters = {}, page = 1, limit = 10, sortBy = 'createdAt', sortOrder: 'asc' | 'desc' = 'desc') {
    // Filters are already properly formatted in the controller, just pass them through
    return this.repo.findMany(filters as any, { page, limit, sortBy, sortOrder });
  }

  getByIdOrAlt(idOrVin: string) {
    // Controller first tries id; service will attempt the alternative lookup by VIN (public)
    return this.repo.findByVin(idOrVin, false);
  }

  // Internal alternative lookup that includes sensitive fields
  getByIdOrAltInternal(idOrVin: string) {
    return this.repo.findByVin(idOrVin, true);
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

  // Patch method for partial updates
  patch(id: string, data: Partial<IVehicle>) {
    return this.repo.patch(id, data);
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
