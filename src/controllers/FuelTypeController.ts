import { Request, Response } from 'express';
import { FuelTypeService } from '../services/FuelTypeService';
import { FuelTypeListFilters } from '../types/fuelType';

export class FuelTypeController {
  private fuelTypeService: FuelTypeService;

  constructor() {
    this.fuelTypeService = new FuelTypeService();
  }

  // Get all fuel types
  getAllFuelTypes = async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        active,
        sortBy = 'name',
        sortOrder = 'asc'
      } = req.query;

      const filters: FuelTypeListFilters = {};
      
      if (search) filters.search = search as string;
      if (active !== undefined) filters.active = active === 'true';

      const result = await this.fuelTypeService.getAllFuelTypes(
        filters,
        parseInt(page as string),
        parseInt(limit as string),
        sortBy as string,
        sortOrder as 'asc' | 'desc'
      );

      res.status(200).json({
        success: true,
        message: 'Fuel types retrieved successfully',
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve fuel types',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Get active fuel types for dropdown
  getActiveFuelTypes = async (req: Request, res: Response): Promise<void> => {
    try {
      const fuelTypes = await this.fuelTypeService.getActiveFuelTypes();

      res.status(200).json({
        success: true,
        message: 'Active fuel types retrieved successfully',
        data: fuelTypes,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve active fuel types',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Get fuel type by ID
  getFuelTypeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const fuelType = await this.fuelTypeService.getFuelTypeById(id);

      if (!fuelType) {
        res.status(404).json({
          success: false,
          message: 'Fuel type not found',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Fuel type retrieved successfully',
        data: fuelType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve fuel type',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Get fuel type by slug
  getFuelTypeBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      const fuelType = await this.fuelTypeService.getFuelTypeBySlug(slug);

      if (!fuelType) {
        res.status(404).json({
          success: false,
          message: 'Fuel type not found',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Fuel type retrieved successfully',
        data: fuelType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve fuel type',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Create new fuel type
  createFuelType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, active } = req.body;

      const fuelType = await this.fuelTypeService.createFuelType({
        name,
        active
      });

      res.status(201).json({
        success: true,
        message: 'Fuel type created successfully',
        data: fuelType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Fuel type with this name already exists') {
        res.status(409).json({
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create fuel type',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Update fuel type
  updateFuelType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, active } = req.body;

      const fuelType = await this.fuelTypeService.updateFuelType(id, {
        name,
        active
      });

      if (!fuelType) {
        res.status(404).json({
          success: false,
          message: 'Fuel type not found',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Fuel type updated successfully',
        data: fuelType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'Fuel type not found' ||
        error.message === 'Fuel type with this name already exists'
      )) {
        res.status(error.message === 'Fuel type not found' ? 404 : 409).json({
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update fuel type',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Update fuel type status
  updateFuelTypeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { active } = req.body;

      const fuelType = await this.fuelTypeService.updateFuelTypeStatus(id, active);

      if (!fuelType) {
        res.status(404).json({
          success: false,
          message: 'Fuel type not found',
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Fuel type status updated successfully',
        data: fuelType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Fuel type not found') {
        res.status(404).json({
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update fuel type status',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Delete fuel type
  deleteFuelType = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      await this.fuelTypeService.deleteFuelType(id);

      res.status(200).json({
        success: true,
        message: 'Fuel type deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Fuel type not found') {
        res.status(404).json({
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to delete fuel type',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Search fuel types
  searchFuelTypes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;

      const fuelTypes = await this.fuelTypeService.searchFuelTypes(q as string);

      res.status(200).json({
        success: true,
        message: 'Fuel types search completed successfully',
        data: fuelTypes,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to search fuel types',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Get popular fuel types
  getPopularFuelTypes = async (req: Request, res: Response): Promise<void> => {
    try {
      const { limit = 10 } = req.query;

      const fuelTypes = await this.fuelTypeService.getPopularFuelTypes(parseInt(limit as string));

      res.status(200).json({
        success: true,
        message: 'Popular fuel types retrieved successfully',
        data: fuelTypes,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve popular fuel types',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Get fuel type statistics
  getFuelTypeStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const statistics = await this.fuelTypeService.getFuelTypeStatistics();

      res.status(200).json({
        success: true,
        message: 'Fuel type statistics retrieved successfully',
        data: statistics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve fuel type statistics',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  };
}
