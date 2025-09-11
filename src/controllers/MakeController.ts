import { Request, Response } from 'express';
import type { IMake } from '@/types/make';
import { makeService } from '@/services/MakeService.js';
import { createApiResponse } from '@/utils/index.js';
import { validationResult } from 'express-validator';

export class MakeController {
  // GET /makes - Get all makes with filtering and pagination
  static async getAllMakes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Build filter object
      const filters: any = {};

      if (req.query.active !== undefined) {
        filters.active = req.query.active === 'true';
      }

      if (req.query.country) {
        filters.country = req.query.country as string;
      }

      if (req.query.search) {
        filters.search = req.query.search as string;
      }

      const { data: makes, pagination } = await makeService.list(filters, page, limit);

      const response = createApiResponse(
        true,
        'Makes retrieved successfully',
        {
          makes,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve makes',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /makes/:id - Get make by ID
  static async getMake(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const make = await makeService.getById(id);

      if (!make) {
        const response = createApiResponse(false, 'Make not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Make retrieved successfully',
        make
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve make',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /makes/slug/:slug - Get make by slug
  static async getMakeBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const make = await makeService.getBySlug(slug);

      if (!make) {
        const response = createApiResponse(false, 'Make not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Make retrieved successfully',
        make
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve make',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // POST /makes - Create new make
  static async createMake(req: Request, res: Response): Promise<void> {
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

      const make = await makeService.create(req.body as Partial<IMake>);

      const response = createApiResponse(
        true,
        'Make created successfully',
        make
      );

      res.status(201).json(response);
    } catch (error) {
      let statusCode = 500;
      let message = 'Failed to create make';

      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          statusCode = 409;
          message = error.message;
        } else if (error.message.includes('duplicate key')) {
          statusCode = 409;
          message = 'Make with this name already exists';
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

  // PUT /makes/:id - Update make
  static async updateMake(req: Request, res: Response): Promise<void> {
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
      const make = await makeService.update(id, req.body as Partial<IMake>);

      if (!make) {
        const response = createApiResponse(false, 'Make not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Make updated successfully',
        make
      );

      res.status(200).json(response);
    } catch (error) {
      let statusCode = 500;
      let message = 'Failed to update make';

      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          statusCode = 409;
          message = error.message;
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

  // DELETE /makes/:id - Delete make
  static async deleteMake(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await makeService.remove(id);

      if (!deleted) {
        const response = createApiResponse(false, 'Make not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Make deleted successfully',
        { deletedMake: id }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to delete make',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // PATCH /makes/:id/status - Update make status
  static async updateMakeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { active } = req.body;

      if (typeof active !== 'boolean') {
        const response = createApiResponse(
          false,
          'Invalid status. Must be a boolean value (true/false)'
        );
        res.status(400).json(response);
        return;
      }

      const make = await makeService.updateStatus(id, active);

      if (!make) {
        const response = createApiResponse(false, 'Make not found');
        res.status(404).json(response);
        return;
      }

      const response = createApiResponse(
        true,
        'Make status updated successfully',
        { make: make._id, newStatus: active }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to update make status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /makes/search - Search makes
  static async searchMakes(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (!q) {
        const response = createApiResponse(false, 'Search query is required');
        res.status(400).json(response);
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data: makes, pagination } = await makeService.search(q as string, page, limit);

      const response = createApiResponse(
        true,
        'Make search completed successfully',
        {
          makes,
          searchQuery: q,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to search makes',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /makes/active - Get active makes
  static async getActiveMakes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data: makes, pagination } = await makeService.getActive(page, limit);

      const response = createApiResponse(
        true,
        'Active makes retrieved successfully',
        {
          makes,
          pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve active makes',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /makes/popular - Get popular makes
  static async getPopularMakes(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const makes = await makeService.getPopular(limit);

      const response = createApiResponse(
        true,
        'Popular makes retrieved successfully',
        makes
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve popular makes',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /makes/stats - Get make statistics
  static async getMakeStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await makeService.getStats();

      const response = createApiResponse(
        true,
        'Make statistics retrieved successfully',
        stats
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve make statistics',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }
}
