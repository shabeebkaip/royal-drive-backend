import { Request, Response } from 'express';
import type { IVehicle } from '@/types/vehicle';
import { vehicleService } from '@/services/VehicleService.js';
import { createApiResponse } from '@/utils/index.js';
import { validationResult } from 'express-validator';

export class VehicleController {
  // Get all vehicles with filtering and pagination
  static async getAllVehicles(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter: any = {};

      if (req.query.make) filter.make = new RegExp(req.query.make as string, 'i');
      if (req.query.model) filter.model = new RegExp(req.query.model as string, 'i');
      if (req.query.year) filter.year = parseInt(req.query.year as string);
      if (req.query.condition) filter.condition = req.query.condition;
      if (req.query.bodyType) filter.bodyType = req.query.bodyType;
      if (req.query.fuelType) filter['engine.fuelType'] = req.query.fuelType;
      if (req.query.status) filter.status = req.query.status;

      // Price range filtering
      if (req.query.minPrice || req.query.maxPrice) {
        filter['pricing.listPrice'] = {};
        if (req.query.minPrice) filter['pricing.listPrice'].$gte = parseInt(req.query.minPrice as string);
        if (req.query.maxPrice) filter['pricing.listPrice'].$lte = parseInt(req.query.maxPrice as string);
      }

      // Year range filtering
      if (req.query.minYear || req.query.maxYear) {
        filter.year = {};
        if (req.query.minYear) filter.year.$gte = parseInt(req.query.minYear as string);
        if (req.query.maxYear) filter.year.$lte = parseInt(req.query.maxYear as string);
      }

  const { data: vehicles, pagination } = await vehicleService.list(filter as any, page, limit);

      const response = createApiResponse(
        true,
        'Vehicles retrieved successfully',
        {
          vehicles,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve vehicles',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // Get vehicle by ID or VIN
  static async getVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Try to find by MongoDB ID first, then by VIN, then by stock number
  let vehicle = await vehicleService.getById(id);
  if (!vehicle) vehicle = await vehicleService.getByIdOrAlt(id);

      if (!vehicle) {
        const response = createApiResponse(false, 'Vehicle not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Vehicle retrieved successfully',
        vehicle
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve vehicle',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // Create new vehicle
  static async createVehicle(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response = createApiResponse(
          false,
          'Validation failed',
          undefined,
          errors.array().map(err => `${(err as any).param}: ${err.msg}`).join(', ')
        );
        res.status(400).json(response);
        return;
      }

  const vehicle = await vehicleService.create(req.body as Partial<IVehicle>);

      const response = createApiResponse(
        true,
        'Vehicle created successfully',
        vehicle
      );

      res.status(201).json(response);
    } catch (error) {
      let statusCode = 500;
      let message = 'Failed to create vehicle';

      if (error instanceof Error) {
        if (error.message.includes('vin_1 dup key')) {
          statusCode = 409;
          message = 'Vehicle with this VIN already exists';
        } else if (error.message.includes('stockNumber_1 dup key')) {
          statusCode = 409;
          message = 'Vehicle with this stock number already exists';
        }
      }

      const errorResponse = createApiResponse(
        false,
        message,
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // Update vehicle
  static async updateVehicle(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response = createApiResponse(
          false,
          'Validation failed',
          undefined,
          errors.array().map(err => `${(err as any).param}: ${err.msg}`).join(', ')
        );
        res.status(400).json(response);
        return;
      }

      const { id } = req.params;
  const vehicle = await vehicleService.update(id, req.body as Partial<IVehicle>);

      if (!vehicle) {
        const response = createApiResponse(false, 'Vehicle not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Vehicle updated successfully',
        vehicle
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to update vehicle',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // Delete vehicle
  static async deleteVehicle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
  const deleted = await vehicleService.remove(id);

      if (!deleted) {
        const response = createApiResponse(false, 'Vehicle not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Vehicle deleted successfully',
        { deletedVehicle: id }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to delete vehicle',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // Get vehicles by dealership
  static async getVehiclesByDealership(req: Request, res: Response): Promise<void> {
    try {
  const { dealershipName } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

  // Enforce single dealership regardless of param
  const filter = { 'location.dealershipName': 'Royal Drive Canada' } as any;

  const { data: vehicles, pagination } = await vehicleService.list(filter as any, page, limit);

      const response = createApiResponse(
        true,
        `Vehicles for ${dealershipName} retrieved successfully`,
        {
          vehicles,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve vehicles by dealership',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // Get featured vehicles
  static async getFeaturedVehicles(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 6;

  const vehicles = await vehicleService.getFeatured(limit);

      const response = createApiResponse(
        true,
        'Featured vehicles retrieved successfully',
        vehicles
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve featured vehicles',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // Search vehicles
  static async searchVehicles(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (!q) {
        const response = createApiResponse(false, 'Search query is required');
        res.status(400).json(response);
        return;
      }

      const searchRegex = new RegExp(q as string, 'i');
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

  const { data: vehicles, pagination } = await vehicleService.search(q as string, page, limit);

      const response = createApiResponse(
        true,
        'Vehicle search completed successfully',
        {
          vehicles,
          searchQuery: q,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to search vehicles',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // Update vehicle status
  static async updateVehicleStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['available', 'sold', 'pending', 'reserved', 'on-hold'].includes(status)) {
        const response = createApiResponse(
          false,
          'Invalid status. Must be one of: available, sold, pending, reserved, on-hold'
        );
        res.status(400).json(response);
        return;
      }

  const vehicle = await vehicleService.updateStatus(id, status as IVehicle['status']);

      if (!vehicle) {
        const response = createApiResponse(false, 'Vehicle not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Vehicle status updated successfully',
        { vehicle: vehicle._id, newStatus: status }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to update vehicle status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }
}
