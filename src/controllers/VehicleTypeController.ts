import { Request, Response } from 'express';
import type { IVehicleType } from '../types/vehicleType.js';
import { vehicleTypeService } from '../services/VehicleTypeService.js';
import { createApiResponse } from '@/utils/index';
import { validationResult } from 'express-validator';

export class VehicleTypeController {
  // GET /vehicle-types - Get all vehicle types with filtering and pagination
  static async getAllVehicleTypes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Build filter object
      const filters: any = {};

      if (req.query.active !== undefined) {
        filters.active = req.query.active === 'true';
      }

      if (req.query.search) {
        filters.search = req.query.search as string;
      }

      const { data: vehicleTypes, pagination } = await vehicleTypeService.list(filters, page, limit);

      const response = createApiResponse(
        true,
        'Vehicle types retrieved successfully',
        {
          vehicleTypes,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve vehicle types',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /vehicle-types/:id - Get vehicle type by ID
  static async getVehicleType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const vehicleType = await vehicleTypeService.getById(id);

      if (!vehicleType) {
        const response = createApiResponse(false, 'Vehicle type not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Vehicle type retrieved successfully',
        vehicleType
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve vehicle type',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /vehicle-types/slug/:slug - Get vehicle type by slug
  static async getVehicleTypeBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const vehicleType = await vehicleTypeService.getBySlug(slug);

      if (!vehicleType) {
        const response = createApiResponse(false, 'Vehicle type not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Vehicle type retrieved successfully',
        vehicleType
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve vehicle type',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // POST /vehicle-types - Create new vehicle type
  static async createVehicleType(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response = createApiResponse(
          false,
          'Validation failed',
          undefined,
          errors.array().map(err => err.msg).join(', ')
        );
        res.status(400).json(response);
        return;
      }

      const vehicleTypeData: Partial<IVehicleType> = {
        name: req.body.name,
        icon: req.body.icon,
        description: req.body.description,
        active: req.body.active ?? true,
      };

      const vehicleType = await vehicleTypeService.create(vehicleTypeData);

      const response = createApiResponse(
        true,
        'Vehicle type created successfully',
        vehicleType
      );

      res.status(201).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to create vehicle type',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      // Handle duplicate name error
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json(errorResponse);
      } else {
        res.status(500).json(errorResponse);
      }
    }
  }

  // PUT /vehicle-types/:id - Update vehicle type
  static async updateVehicleType(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response = createApiResponse(
          false,
          'Validation failed',
          undefined,
          errors.array().map(err => err.msg).join(', ')
        );
        res.status(400).json(response);
        return;
      }

      const { id } = req.params;
      const updateData: Partial<IVehicleType> = {
        name: req.body.name,
        icon: req.body.icon,
        description: req.body.description,
        active: req.body.active,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key as keyof IVehicleType] === undefined && delete updateData[key as keyof IVehicleType]
      );

      const vehicleType = await vehicleTypeService.update(id, updateData);

      if (!vehicleType) {
        const response = createApiResponse(false, 'Vehicle type not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Vehicle type updated successfully',
        vehicleType
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to update vehicle type',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      // Handle duplicate name error
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json(errorResponse);
      } else {
        res.status(500).json(errorResponse);
      }
    }
  }

  // DELETE /vehicle-types/:id - Delete vehicle type
  static async deleteVehicleType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await vehicleTypeService.remove(id);

      if (!deleted) {
        const response = createApiResponse(false, 'Vehicle type not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(true, 'Vehicle type deleted successfully');
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to delete vehicle type',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // PATCH /vehicle-types/:id/status - Update vehicle type status
  static async updateVehicleTypeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { active } = req.body;

      if (typeof active !== 'boolean') {
        const response = createApiResponse(
          false,
          'Active status must be a boolean value'
        );
        res.status(400).json(response);
        return;
      }

      const vehicleType = await vehicleTypeService.updateStatus(id, active);

      if (!vehicleType) {
        const response = createApiResponse(false, 'Vehicle type not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        `Vehicle type ${active ? 'activated' : 'deactivated'} successfully`,
        vehicleType
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to update vehicle type status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /vehicle-types/search - Search vehicle types
  static async searchVehicleTypes(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        const response = createApiResponse(
          false,
          'Search query is required'
        );
        res.status(400).json(response);
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data: vehicleTypes, pagination } = await vehicleTypeService.search(q, page, limit);

      const response = createApiResponse(
        true,
        'Vehicle types search completed',
        {
          vehicleTypes,
          pagination,
          query: q
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to search vehicle types',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /vehicle-types/active - Get active vehicle types
  static async getActiveVehicleTypes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data: vehicleTypes, pagination } = await vehicleTypeService.getActive(page, limit);

      const response = createApiResponse(
        true,
        'Active vehicle types retrieved successfully',
        {
          vehicleTypes,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve active vehicle types',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /vehicle-types/popular - Get popular vehicle types
  static async getPopularVehicleTypes(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const vehicleTypes = await vehicleTypeService.getPopular(limit);

      const response = createApiResponse(
        true,
        'Popular vehicle types retrieved successfully',
        vehicleTypes
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve popular vehicle types',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /vehicle-types/stats - Get vehicle type statistics
  static async getVehicleTypeStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await vehicleTypeService.getStats();

      const response = createApiResponse(
        true,
        'Vehicle type statistics retrieved successfully',
        stats
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve vehicle type statistics',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /vehicle-types/dropdown - Get active vehicle types for dropdown selection
  static async getVehicleTypesDropdown(req: Request, res: Response): Promise<void> {
    try {
      const vehicleTypes = await vehicleTypeService.getDropdown();

      const response = createApiResponse(
        true,
        'Active vehicle types retrieved successfully',
        vehicleTypes
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve vehicle types for dropdown',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }
}
