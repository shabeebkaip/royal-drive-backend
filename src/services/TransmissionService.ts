import { TransmissionRepository } from '../repositories/TransmissionRepository.js';
import { 
  ITransmission, 
  TransmissionListFilters,
  CreateTransmissionRequest,
  UpdateTransmissionRequest 
} from '../types/transmission.js';

export class TransmissionService {
  // Get all transmissions with filtering and pagination
  static async getAllTransmissions(filters: TransmissionListFilters) {
    try {
      const result = await TransmissionRepository.getAll(filters);
      return result;
    } catch (error) {
      throw new Error('Failed to retrieve transmissions');
    }
  }

  // Get active transmissions for dropdown
  static async getActiveTransmissions(): Promise<ITransmission[]> {
    try {
      return await TransmissionRepository.getActiveForDropdown();
    } catch (error) {
      throw new Error('Failed to retrieve active transmissions');
    }
  }

  // Get transmission by ID
  static async getTransmissionById(id: string): Promise<ITransmission> {
    try {
      const transmission = await TransmissionRepository.getById(id);
      if (!transmission) {
        const error = new Error('Transmission not found') as any;
        error.statusCode = 404;
        throw error;
      }
      return transmission;
    } catch (error) {
      if ((error as any).statusCode) throw error;
      throw new Error('Failed to retrieve transmission');
    }
  }

  // Get transmission by slug
  static async getTransmissionBySlug(slug: string): Promise<ITransmission> {
    try {
      const transmission = await TransmissionRepository.getBySlug(slug);
      if (!transmission) {
        const error = new Error('Transmission not found') as any;
        error.statusCode = 404;
        throw error;
      }
      return transmission;
    } catch (error) {
      if ((error as any).statusCode) throw error;
      throw new Error('Failed to retrieve transmission');
    }
  }

  // Create new transmission
  static async createTransmission(data: CreateTransmissionRequest): Promise<ITransmission> {
    try {
      // Check if transmission name already exists
      const exists = await TransmissionRepository.existsByName(data.name);
      if (exists) {
        const error = new Error('Transmission name already exists') as any;
        error.statusCode = 409;
        throw error;
      }

      return await TransmissionRepository.create(data);
    } catch (error) {
      if ((error as any).statusCode) throw error;
      throw new Error('Failed to create transmission');
    }
  }

  // Update transmission
  static async updateTransmission(id: string, data: UpdateTransmissionRequest): Promise<ITransmission> {
    try {
      // Check if transmission exists
      const existingTransmission = await TransmissionRepository.getById(id);
      if (!existingTransmission) {
        const error = new Error('Transmission not found') as any;
        error.statusCode = 404;
        throw error;
      }

      // Check if new name already exists (excluding current transmission)
      if (data.name) {
        const nameExists = await TransmissionRepository.existsByName(data.name, id);
        if (nameExists) {
          const error = new Error('Transmission name already exists') as any;
          error.statusCode = 409;
          throw error;
        }
      }

      const updatedTransmission = await TransmissionRepository.update(id, data);
      if (!updatedTransmission) {
        throw new Error('Failed to update transmission');
      }

      return updatedTransmission;
    } catch (error) {
      if ((error as any).statusCode) throw error;
      throw new Error('Failed to update transmission');
    }
  }

  // Update transmission status
  static async updateTransmissionStatus(id: string, active: boolean): Promise<ITransmission> {
    try {
      const transmission = await TransmissionRepository.updateStatus(id, active);
      if (!transmission) {
        const error = new Error('Transmission not found') as any;
        error.statusCode = 404;
        throw error;
      }
      return transmission;
    } catch (error) {
      if ((error as any).statusCode) throw error;
      throw new Error('Failed to update transmission status');
    }
  }

  // Delete transmission
  static async deleteTransmission(id: string): Promise<void> {
    try {
      const transmission = await TransmissionRepository.delete(id);
      if (!transmission) {
        const error = new Error('Transmission not found') as any;
        error.statusCode = 404;
        throw error;
      }
    } catch (error) {
      if ((error as any).statusCode) throw error;
      throw new Error('Failed to delete transmission');
    }
  }

  // Search transmissions
  static async searchTransmissions(searchTerm: string): Promise<ITransmission[]> {
    try {
      if (searchTerm.length < 2) {
        const error = new Error('Search term must be at least 2 characters') as any;
        error.statusCode = 400;
        throw error;
      }
      return await TransmissionRepository.search(searchTerm);
    } catch (error) {
      if ((error as any).statusCode) throw error;
      throw new Error('Failed to search transmissions');
    }
  }

  // Get popular transmissions
  static async getPopularTransmissions(): Promise<ITransmission[]> {
    try {
      return await TransmissionRepository.getPopular();
    } catch (error) {
      throw new Error('Failed to retrieve popular transmissions');
    }
  }

  // Get transmission statistics
  static async getTransmissionStats(): Promise<any> {
    try {
      return await TransmissionRepository.getStats();
    } catch (error) {
      throw new Error('Failed to retrieve transmission statistics');
    }
  }
}
