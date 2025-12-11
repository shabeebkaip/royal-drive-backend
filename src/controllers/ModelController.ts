import { Request, Response } from 'express';
import type { IModel } from '../types/model.js';
import { modelService } from '../services/ModelService.js';
import { createApiResponse } from '@/utils/index';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

export class ModelController {
  // GET /models - Get all models with filtering and pagination
  static async getAllModels(req: Request, res: Response): Promise<void> {
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

      if (req.query.make) {
        // Convert make string to ObjectId
        filters.make = new mongoose.Types.ObjectId(req.query.make as string);
      }

      if (req.query.vehicleType) {
        // Convert vehicleType string to ObjectId
        filters.vehicleType = new mongoose.Types.ObjectId(req.query.vehicleType as string);
      }

      const { data: models, pagination } = await modelService.list(filters, page, limit);

      const response = createApiResponse(
        true,
        'Models retrieved successfully',
        {
          models,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve models',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /models/:id - Get model by ID
  static async getModel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const model = await modelService.getById(id);

      if (!model) {
        const response = createApiResponse(false, 'Model not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Model retrieved successfully',
        model
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve model',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /models/slug/:slug - Get model by slug
  static async getModelBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const model = await modelService.getBySlug(slug);

      if (!model) {
        const response = createApiResponse(false, 'Model not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Model retrieved successfully',
        model
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve model',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /models/make/:makeId - Get models by make
  static async getModelsByMake(req: Request, res: Response): Promise<void> {
    try {
      const { makeId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data: models, pagination } = await modelService.getByMake(makeId, page, limit);

      const response = createApiResponse(
        true,
        'Models retrieved successfully',
        {
          models,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve models',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /models/vehicle-type/:vehicleTypeId - Get models by vehicle type
  static async getModelsByVehicleType(req: Request, res: Response): Promise<void> {
    try {
      const { vehicleTypeId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data: models, pagination } = await modelService.getByVehicleType(vehicleTypeId, page, limit);

      const response = createApiResponse(
        true,
        'Models retrieved successfully',
        {
          models,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve models',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // POST /models - Create new model
  static async createModel(req: Request, res: Response): Promise<void> {
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

      const modelData: Partial<IModel> = {
        name: req.body.name,
        make: req.body.make,
        vehicleType: req.body.vehicleType,
        description: req.body.description,
        active: req.body.active ?? true,
      };

      const model = await modelService.create(modelData);

      const response = createApiResponse(
        true,
        'Model created successfully',
        model
      );

      res.status(201).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to create model',
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

  // PUT /models/:id - Update model
  static async updateModel(req: Request, res: Response): Promise<void> {
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
      const updateData: Partial<IModel> = {
        name: req.body.name,
        make: req.body.make,
        vehicleType: req.body.vehicleType,
        description: req.body.description,
        active: req.body.active,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key as keyof IModel] === undefined && delete updateData[key as keyof IModel]
      );

      const model = await modelService.update(id, updateData);

      if (!model) {
        const response = createApiResponse(false, 'Model not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Model updated successfully',
        model
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to update model',
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

  // DELETE /models/:id - Delete model
  static async deleteModel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await modelService.remove(id);

      if (!deleted) {
        const response = createApiResponse(false, 'Model not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(true, 'Model deleted successfully');
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to delete model',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // PATCH /models/:id/status - Update model status
  static async updateModelStatus(req: Request, res: Response): Promise<void> {
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

      const model = await modelService.updateStatus(id, active);

      if (!model) {
        const response = createApiResponse(false, 'Model not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        `Model ${active ? 'activated' : 'deactivated'} successfully`,
        model
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to update model status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /models/search - Search models
  static async searchModels(req: Request, res: Response): Promise<void> {
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

      const { data: models, pagination } = await modelService.search(q, page, limit);

      const response = createApiResponse(
        true,
        'Models search completed',
        {
          models,
          pagination,
          query: q
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to search models',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /models/active - Get active models
  static async getActiveModels(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data: models, pagination } = await modelService.getActive(page, limit);

      const response = createApiResponse(
        true,
        'Active models retrieved successfully',
        {
          models,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve active models',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /models/popular - Get popular models
  static async getPopularModels(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const models = await modelService.getPopular(limit);

      const response = createApiResponse(
        true,
        'Popular models retrieved successfully',
        models
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve popular models',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /models/stats - Get model statistics
  static async getModelStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await modelService.getStats();

      const response = createApiResponse(
        true,
        'Model statistics retrieved successfully',
        stats
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve model statistics',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /models/dropdown - Get active models for dropdown selection
  static async getModelsDropdown(req: Request, res: Response): Promise<void> {
    try {
      const models = await modelService.getDropdown();

      const response = createApiResponse(
        true,
        'Active models retrieved successfully',
        models
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve models for dropdown',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }
}
