import { Request, Response } from 'express';
import { StatusService } from '../services/StatusService.js';
import { createApiResponse } from '../utils/index.js';
import { StatusListFilters, CreateStatusRequest, UpdateStatusRequest, UpdateStatusStatusRequest } from '../types/status.js';

const statusService = new StatusService();

export class StatusController {
  // GET /statuses - Get all statuses with filtering and pagination
  static async getAllStatuses(req: Request, res: Response): Promise<void> {
    try {
      const filters: StatusListFilters = {
        search: req.query.search as string,
        sortBy: (req.query.sortBy as 'name' | 'createdAt' | 'updatedAt') || 'name',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      };

      // Only add filters if explicitly provided
      if (req.query.active !== undefined) {
        filters.active = req.query.active === 'true';
      }

      if (req.query.isDefault !== undefined) {
        filters.isDefault = req.query.isDefault === 'true';
      }

      const result = await statusService.getAllStatuses(filters);

      const response = createApiResponse(
        true,
        'Statuses retrieved successfully',
        {
          statuses: result.data,
          pagination: result.pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve statuses',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /statuses/active - Get active statuses
  static async getActiveStatuses(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await statusService.getActiveStatuses(page, limit);

      const response = createApiResponse(
        true,
        'Active statuses retrieved successfully',
        {
          statuses: result.data,
          pagination: result.pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve active statuses',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /statuses/search - Search statuses
  static async searchStatuses(req: Request, res: Response): Promise<void> {
    try {
      const query = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        const errorResponse = createApiResponse(
          false,
          'Search query is required',
          undefined,
          'Please provide a search query parameter "q"'
        );
        res.status(400).json(errorResponse);
        return;
      }

      const result = await statusService.searchStatuses(query, page, limit);

      const response = createApiResponse(
        true,
        'Statuses search completed',
        {
          statuses: result.data,
          pagination: result.pagination,
          query
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to search statuses',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /statuses/stats - Get status statistics
  static async getStatusStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await statusService.getStats();

      const response = createApiResponse(
        true,
        'Status statistics retrieved successfully',
        stats
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve status statistics',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /statuses/dropdown - Get active statuses for dropdown selection
  static async getStatusesDropdown(req: Request, res: Response): Promise<void> {
    try {
      const statuses = await statusService.getDropdown();

      const response = createApiResponse(
        true,
        'Active statuses retrieved successfully',
        statuses
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve statuses for dropdown',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /statuses/default - Get default status
  static async getDefaultStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = await statusService.getDefaultStatus();

      const response = createApiResponse(
        true,
        'Default status retrieved successfully',
        status
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve default status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // GET /statuses/slug/:slug - Get status by slug
  static async getStatusBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const status = await statusService.getStatusBySlug(slug);

      const response = createApiResponse(
        true,
        'Status retrieved successfully',
        status
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // GET /statuses/:id - Get status by ID
  static async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const status = await statusService.getStatusById(id);

      const response = createApiResponse(
        true,
        'Status retrieved successfully',
        status
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // POST /statuses - Create new status
  static async createStatus(req: Request, res: Response): Promise<void> {
    try {
      const statusData: CreateStatusRequest = req.body;
      const status = await statusService.createStatus(statusData);

      const response = createApiResponse(
        true,
        'Status created successfully',
        status
      );

      res.status(201).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && 
        (error.message.includes('already exists') || error.message.includes('duplicate')) ? 409 : 500;
      
      const errorResponse = createApiResponse(
        false,
        'Failed to create status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // PUT /statuses/:id - Update status
  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const statusData: UpdateStatusRequest = req.body;
      const status = await statusService.updateStatus(id, statusData);

      const response = createApiResponse(
        true,
        'Status updated successfully',
        status
      );

      res.status(200).json(response);
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message.includes('not found')) statusCode = 404;
        else if (error.message.includes('already exists')) statusCode = 409;
      }

      const errorResponse = createApiResponse(
        false,
        'Failed to update status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // PATCH /statuses/:id/status - Update status active state
  static async updateStatusStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const statusData: UpdateStatusStatusRequest = req.body;
      const status = await statusService.updateStatusStatus(id, statusData);

      const response = createApiResponse(
        true,
        'Status updated successfully',
        status
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      const errorResponse = createApiResponse(
        false,
        'Failed to update status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // PATCH /statuses/:id/default - Set as default status
  static async setDefaultStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const status = await statusService.setDefaultStatus(id);

      const response = createApiResponse(
        true,
        'Default status set successfully',
        status
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      const errorResponse = createApiResponse(
        false,
        'Failed to set default status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // PATCH /statuses/bulk/status - Bulk update status active state
  static async bulkUpdateStatusStatus(req: Request, res: Response): Promise<void> {
    try {
      const { ids, active } = req.body;
      const updatedCount = await statusService.bulkUpdateStatus(ids, active);

      const response = createApiResponse(
        true,
        `${updatedCount} statuses updated successfully`,
        { updatedCount, active }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to bulk update status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // DELETE /statuses/:id - Delete status
  static async deleteStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await statusService.deleteStatus(id);

      const response = createApiResponse(
        true,
        'Status deleted successfully',
        { deletedId: id }
      );

      res.status(200).json(response);
    } catch (error) {
      let statusCode = 500;
      if (error instanceof Error) {
        if (error.message.includes('not found')) statusCode = 404;
        else if (error.message.includes('Cannot delete')) statusCode = 400;
      }

      const errorResponse = createApiResponse(
        false,
        'Failed to delete status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }
}
