import type { IVehicle, VehicleListFilters } from '../types/vehicle.d.js';
import { VehicleRepository } from '../repositories/VehicleRepository.js';
import { cache } from '../utils/cache.js';

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

  // Get vehicle by slug - OPTIMIZED with caching for Next.js SSR
  // ALWAYS public (for website), never expose internal data
  async getBySlug(slug: string) {
    // Check cache first (5 minute TTL)
    const cacheKey = `vehicle:slug:${slug}`;
    const cached = cache.get<IVehicle>(cacheKey);
    
    if (cached) {
      return cached;
    }

    // Cache miss - fetch from database
    const vehicle = await this.repo.findBySlug(slug);
    
    // Cache the result for 5 minutes
    if (vehicle) {
      cache.set(cacheKey, vehicle, 5 * 60 * 1000);
    }
    
    return vehicle;
  }

  async create(data: Partial<IVehicle>) {
    const vehicle = await this.repo.create(data);
    // Invalidate list caches when new vehicle is created
    cache.deletePattern('vehicle:list:*');
    return vehicle;
  }

  async update(id: string, data: Partial<IVehicle>) {
    const vehicle = await this.repo.update(id, data);
    // Invalidate caches for this vehicle
    if (vehicle?.marketing?.slug) {
      cache.delete(`vehicle:slug:${vehicle.marketing.slug}`);
    }
    cache.delete(`vehicle:id:${id}`);
    cache.deletePattern('vehicle:list:*');
    return vehicle;
  }

  // Internal update method that returns acquisition cost and sensitive data
  async updateInternal(id: string, data: Partial<IVehicle>) {
    const vehicle = await this.repo.updateInternal(id, data);
    // Invalidate caches for this vehicle
    if (vehicle?.marketing?.slug) {
      cache.delete(`vehicle:slug:${vehicle.marketing.slug}`);
    }
    cache.delete(`vehicle:id:${id}`);
    cache.deletePattern('vehicle:list:*');
    return vehicle;
  }

  // Patch method for partial updates
  async patch(id: string, data: Partial<IVehicle>) {
    const vehicle = await this.repo.patch(id, data);
    // Invalidate caches for this vehicle
    if (vehicle?.marketing?.slug) {
      cache.delete(`vehicle:slug:${vehicle.marketing.slug}`);
    }
    cache.delete(`vehicle:id:${id}`);
    cache.deletePattern('vehicle:list:*');
    return vehicle;
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    // Invalidate all caches when vehicle is deleted
    cache.delete(`vehicle:id:${id}`);
    cache.deletePattern('vehicle:slug:*');
    cache.deletePattern('vehicle:list:*');
    return result;
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
