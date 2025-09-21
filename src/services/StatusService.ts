import { StatusRepository } from '@/repositories/StatusRepository';
import { IStatus, StatusListFilters, CreateStatusRequest, UpdateStatusRequest, UpdateStatusStatusRequest } from '@/types/status';

export class StatusService {
  private statusRepository: StatusRepository;

  constructor() {
    this.statusRepository = new StatusRepository();
  }

  // Get all statuses with filtering and pagination
  async getAllStatuses(filters: StatusListFilters = {}) {
    try {
      return await this.statusRepository.findAll(filters);
    } catch (error) {
      throw new Error(`Failed to retrieve statuses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get status by ID
  async getStatusById(id: string): Promise<IStatus> {
    try {
      const status = await this.statusRepository.findById(id);
      if (!status) {
        throw new Error('Status not found');
      }
      return status;
    } catch (error) {
      throw new Error(`Failed to retrieve status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get status by slug
  async getStatusBySlug(slug: string): Promise<IStatus> {
    try {
      const status = await this.statusRepository.findBySlug(slug);
      if (!status) {
        throw new Error('Status not found');
      }
      return status;
    } catch (error) {
      throw new Error(`Failed to retrieve status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get status by code
  async getStatusByCode(code: string): Promise<IStatus> {
    try {
      const status = await this.statusRepository.findByCode(code);
      if (!status) {
        throw new Error('Status not found');
      }
      return status;
    } catch (error) {
      throw new Error(`Failed to retrieve status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get default status
  async getDefaultStatus(): Promise<IStatus> {
    try {
      const status = await this.statusRepository.findDefault();
      if (!status) {
        throw new Error('No default status found');
      }
      return status;
    } catch (error) {
      throw new Error(`Failed to retrieve default status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Create new status
  async createStatus(statusData: CreateStatusRequest): Promise<IStatus> {
    try {
      // Check if status with same name exists
      const nameExists = await this.statusRepository.existsByName(statusData.name);
      if (nameExists) {
        throw new Error('Status with this name already exists');
      }

      // Check if status with same code exists
      const codeExists = await this.statusRepository.existsByCode(statusData.code);
      if (codeExists) {
        throw new Error('Status with this code already exists');
      }

      return await this.statusRepository.create(statusData);
    } catch (error) {
      throw new Error(`Failed to create status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update status
  async updateStatus(id: string, statusData: UpdateStatusRequest): Promise<IStatus> {
    try {
      // Check if status exists
      const existingStatus = await this.statusRepository.findById(id);
      if (!existingStatus) {
        throw new Error('Status not found');
      }

      // Check if name is being updated and if it conflicts
      if (statusData.name && statusData.name !== existingStatus.name) {
        const nameExists = await this.statusRepository.existsByName(statusData.name, id);
        if (nameExists) {
          throw new Error('Status with this name already exists');
        }
      }

      // Check if code is being updated and if it conflicts
      if (statusData.code && statusData.code !== existingStatus.code) {
        const codeExists = await this.statusRepository.existsByCode(statusData.code, id);
        if (codeExists) {
          throw new Error('Status with this code already exists');
        }
      }

      const updatedStatus = await this.statusRepository.update(id, statusData);
      if (!updatedStatus) {
        throw new Error('Failed to update status');
      }

      return updatedStatus;
    } catch (error) {
      throw new Error(`Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update status active state
  async updateStatusStatus(id: string, statusData: UpdateStatusStatusRequest): Promise<IStatus> {
    try {
      const updatedStatus = await this.statusRepository.update(id, statusData);
      if (!updatedStatus) {
        throw new Error('Status not found or update failed');
      }
      return updatedStatus;
    } catch (error) {
      throw new Error(`Failed to update status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Set default status
  async setDefaultStatus(id: string): Promise<IStatus> {
    try {
      const status = await this.statusRepository.findById(id);
      if (!status) {
        throw new Error('Status not found');
      }

      const updatedStatus = await this.statusRepository.setDefault(id);
      if (!updatedStatus) {
        throw new Error('Failed to set default status');
      }

      return updatedStatus;
    } catch (error) {
      throw new Error(`Failed to set default status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete status
  async deleteStatus(id: string): Promise<void> {
    try {
      const status = await this.statusRepository.findById(id);
      if (!status) {
        throw new Error('Status not found');
      }

      // Check if it's the default status
      if (status.isDefault) {
        throw new Error('Cannot delete the default status. Set another status as default first.');
      }

      // TODO: Check if status is being used by any vehicles
      // You might want to prevent deletion if vehicles are using this status
      // const vehicleCount = await this.getVehicleCountForStatus(id);
      // if (vehicleCount > 0) {
      //   throw new Error('Cannot delete status that is being used by vehicles');
      // }

      await this.statusRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Search statuses
  async searchStatuses(query: string, page: number = 1, limit: number = 10) {
    try {
      return await this.statusRepository.search(query, { page, limit });
    } catch (error) {
      throw new Error(`Failed to search statuses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get active statuses
  async getActiveStatuses(page: number = 1, limit: number = 10) {
    try {
      return await this.statusRepository.findActive({ page, limit });
    } catch (error) {
      throw new Error(`Failed to retrieve active statuses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get status stats
  async getStats() {
    try {
      return await this.statusRepository.getStats();
    } catch (error) {
      throw new Error(`Failed to retrieve status statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get dropdown data for statuses
  async getDropdown() {
    try {
      return await this.statusRepository.findActiveSimple();
    } catch (error) {
      throw new Error(`Failed to retrieve statuses for dropdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Bulk update status active state
  async bulkUpdateStatus(ids: string[], active: boolean): Promise<number> {
    try {
      return await this.statusRepository.bulkUpdateStatus(ids, active);
    } catch (error) {
      throw new Error(`Failed to bulk update status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
