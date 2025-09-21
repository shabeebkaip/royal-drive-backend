import { DriveTypeRepository } from '@/repositories/DriveTypeRepository';
import { IDriveType, DriveTypeListFilters, CreateDriveTypeRequest, UpdateDriveTypeRequest, UpdateDriveTypeStatusRequest } from '@/types/driveType';

export class DriveTypeService {
  private driveTypeRepository: DriveTypeRepository;

  constructor() {
    this.driveTypeRepository = new DriveTypeRepository();
  }

  // Get all drive types with filtering and pagination
  async getAllDriveTypes(filters: DriveTypeListFilters = {}) {
    try {
      return await this.driveTypeRepository.findAll(filters);
    } catch (error) {
      throw new Error(`Failed to retrieve drive types: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get drive type by ID
  async getDriveTypeById(id: string): Promise<IDriveType> {
    try {
      const driveType = await this.driveTypeRepository.findById(id);
      if (!driveType) {
        throw new Error('Drive type not found');
      }
      return driveType;
    } catch (error) {
      throw new Error(`Failed to retrieve drive type: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get drive type by slug
  async getDriveTypeBySlug(slug: string): Promise<IDriveType> {
    try {
      const driveType = await this.driveTypeRepository.findBySlug(slug);
      if (!driveType) {
        throw new Error('Drive type not found');
      }
      return driveType;
    } catch (error) {
      throw new Error(`Failed to retrieve drive type: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get drive type by code
  async getDriveTypeByCode(code: string): Promise<IDriveType> {
    try {
      const driveType = await this.driveTypeRepository.findByCode(code);
      if (!driveType) {
        throw new Error('Drive type not found');
      }
      return driveType;
    } catch (error) {
      throw new Error(`Failed to retrieve drive type: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Create new drive type
  async createDriveType(driveTypeData: CreateDriveTypeRequest): Promise<IDriveType> {
    try {
      // Check if drive type with same name exists
      const nameExists = await this.driveTypeRepository.existsByName(driveTypeData.name);
      if (nameExists) {
        throw new Error('Drive type with this name already exists');
      }

      // Check if drive type with same code exists
      const codeExists = await this.driveTypeRepository.existsByCode(driveTypeData.code);
      if (codeExists) {
        throw new Error('Drive type with this code already exists');
      }

      return await this.driveTypeRepository.create(driveTypeData);
    } catch (error) {
      throw new Error(`Failed to create drive type: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update drive type
  async updateDriveType(id: string, driveTypeData: UpdateDriveTypeRequest): Promise<IDriveType> {
    try {
      // Check if drive type exists
      const existingDriveType = await this.driveTypeRepository.findById(id);
      if (!existingDriveType) {
        throw new Error('Drive type not found');
      }

      // Check if name is being updated and if it conflicts
      if (driveTypeData.name && driveTypeData.name !== existingDriveType.name) {
        const nameExists = await this.driveTypeRepository.existsByName(driveTypeData.name, id);
        if (nameExists) {
          throw new Error('Drive type with this name already exists');
        }
      }

      // Check if code is being updated and if it conflicts
      if (driveTypeData.code && driveTypeData.code !== existingDriveType.code) {
        const codeExists = await this.driveTypeRepository.existsByCode(driveTypeData.code, id);
        if (codeExists) {
          throw new Error('Drive type with this code already exists');
        }
      }

      const updatedDriveType = await this.driveTypeRepository.update(id, driveTypeData);
      if (!updatedDriveType) {
        throw new Error('Failed to update drive type');
      }

      return updatedDriveType;
    } catch (error) {
      throw new Error(`Failed to update drive type: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update drive type status
  async updateDriveTypeStatus(id: string, statusData: UpdateDriveTypeStatusRequest): Promise<IDriveType> {
    try {
      const updatedDriveType = await this.driveTypeRepository.update(id, statusData);
      if (!updatedDriveType) {
        throw new Error('Drive type not found or update failed');
      }
      return updatedDriveType;
    } catch (error) {
      throw new Error(`Failed to update drive type status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete drive type
  async deleteDriveType(id: string): Promise<void> {
    try {
      const driveType = await this.driveTypeRepository.findById(id);
      if (!driveType) {
        throw new Error('Drive type not found');
      }

      // TODO: Check if drive type is being used by any vehicles
      // You might want to prevent deletion if vehicles are using this drive type
      // const vehicleCount = await this.getVehicleCountForDriveType(id);
      // if (vehicleCount > 0) {
      //   throw new Error('Cannot delete drive type that is being used by vehicles');
      // }

      await this.driveTypeRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete drive type: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Search drive types
  async searchDriveTypes(query: string, page: number = 1, limit: number = 10) {
    try {
      return await this.driveTypeRepository.search(query, { page, limit });
    } catch (error) {
      throw new Error(`Failed to search drive types: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get active drive types
  async getActiveDriveTypes(page: number = 1, limit: number = 10) {
    try {
      return await this.driveTypeRepository.findActive({ page, limit });
    } catch (error) {
      throw new Error(`Failed to retrieve active drive types: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get drive type stats
  async getStats() {
    try {
      return await this.driveTypeRepository.getStats();
    } catch (error) {
      throw new Error(`Failed to retrieve drive type statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get dropdown data for drive types
  async getDropdown() {
    try {
      return await this.driveTypeRepository.findActiveSimple();
    } catch (error) {
      throw new Error(`Failed to retrieve drive types for dropdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Bulk update drive type status
  async bulkUpdateStatus(ids: string[], active: boolean): Promise<number> {
    try {
      return await this.driveTypeRepository.bulkUpdateStatus(ids, active);
    } catch (error) {
      throw new Error(`Failed to bulk update drive type status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
