import { FuelTypeRepository } from '../repositories/FuelTypeRepository.js';
import { IFuelType, FuelTypeListFilters } from '../types/fuelType.js';

export class FuelTypeService {
  private fuelTypeRepository: FuelTypeRepository;

  constructor() {
    this.fuelTypeRepository = new FuelTypeRepository();
  }

  // Get all fuel types with filtering and pagination
  async getAllFuelTypes(
    filters: FuelTypeListFilters = {},
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    // Validate pagination parameters
    if (page < 1) page = 1;
    if (limit < 1 || limit > 100) limit = 10;

    return this.fuelTypeRepository.findMany(filters, page, limit, sortBy, sortOrder);
  }

  // Get fuel type by ID
  async getFuelTypeById(id: string): Promise<IFuelType | null> {
    return this.fuelTypeRepository.findById(id);
  }

  // Get fuel type by slug
  async getFuelTypeBySlug(slug: string): Promise<IFuelType | null> {
    return this.fuelTypeRepository.findBySlug(slug);
  }

  // Get active fuel types for dropdown
  async getActiveFuelTypes() {
    return this.fuelTypeRepository.findActiveForDropdown();
  }

  // Create new fuel type
  async createFuelType(data: { name: string; active?: boolean }): Promise<IFuelType> {
    // Check if fuel type with same name already exists
    const exists = await this.fuelTypeRepository.existsByName(data.name);
    if (exists) {
      throw new Error('Fuel type with this name already exists');
    }

    return this.fuelTypeRepository.create({
      name: data.name.trim(),
      active: data.active ?? true
    });
  }

  // Update fuel type
  async updateFuelType(id: string, data: { name?: string; active?: boolean }): Promise<IFuelType | null> {
    // Check if fuel type exists
    const existingFuelType = await this.fuelTypeRepository.findById(id);
    if (!existingFuelType) {
      throw new Error('Fuel type not found');
    }

    // Check if name is being changed and if new name already exists
    if (data.name && data.name.trim() !== existingFuelType.name) {
      const nameExists = await this.fuelTypeRepository.existsByName(data.name.trim(), id);
      if (nameExists) {
        throw new Error('Fuel type with this name already exists');
      }
    }

    const updateData: Partial<IFuelType> = {};
    if (data.name) updateData.name = data.name.trim();
    if (data.active !== undefined) updateData.active = data.active;

    return this.fuelTypeRepository.update(id, updateData);
  }

  // Update fuel type status
  async updateFuelTypeStatus(id: string, active: boolean): Promise<IFuelType | null> {
    const existingFuelType = await this.fuelTypeRepository.findById(id);
    if (!existingFuelType) {
      throw new Error('Fuel type not found');
    }

    return this.fuelTypeRepository.updateStatus(id, active);
  }

  // Delete fuel type
  async deleteFuelType(id: string): Promise<void> {
    const existingFuelType = await this.fuelTypeRepository.findById(id);
    if (!existingFuelType) {
      throw new Error('Fuel type not found');
    }

    // TODO: Add check for vehicles using this fuel type
    // const vehicleCount = existingFuelType.vehicleCount || 0;
    // if (vehicleCount > 0) {
    //   throw new Error('Cannot delete fuel type that is being used by vehicles');
    // }

    const deleted = await this.fuelTypeRepository.delete(id);
    if (!deleted) {
      throw new Error('Failed to delete fuel type');
    }
  }

  // Search fuel types
  async searchFuelTypes(searchTerm: string): Promise<IFuelType[]> {
    if (!searchTerm || searchTerm.trim().length < 2) {
      throw new Error('Search term must be at least 2 characters long');
    }

    return this.fuelTypeRepository.search(searchTerm.trim());
  }

  // Get fuel type statistics
  async getFuelTypeStatistics() {
    return this.fuelTypeRepository.getStatistics();
  }

  // Get popular fuel types
  async getPopularFuelTypes(limit: number = 10): Promise<IFuelType[]> {
    if (limit < 1 || limit > 50) limit = 10;
    return this.fuelTypeRepository.getPopular(limit);
  }
}
