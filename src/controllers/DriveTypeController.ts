import { Request, Response } from 'express';
import { DriveTypeService } from '@/services/DriveTypeService';
import { createApiResponse } from '@/utils';
import { DriveTypeListFilters, CreateDriveTypeRequest, UpdateDriveTypeRequest, UpdateDriveTypeStatusRequest } from '@/types/driveType';

const driveTypeService = new DriveTypeService();

export class DriveTypeController {
  // GET /drive-types - Get all drive types with filtering and pagination
  static async getAllDriveTypes(req: Request, res: Response): Promise<void> {
    try {
      const filters: DriveTypeListFilters = {
        search: req.query.search as string,
        sortBy: (req.query.sortBy as 'name' | 'createdAt' | 'updatedAt') || 'name',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      };

      // Only add active filter if it's explicitly provided
      if (req.query.active !== undefined) {
        filters.active = req.query.active === 'true';
      }

      const result = await driveTypeService.getAllDriveTypes(filters);

      const response = createApiResponse(
        true,
        'Drive types retrieved successfully',
        {
          driveTypes: result.data,
          pagination: result.pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve drive types',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /drive-types/active - Get active drive types
  static async getActiveDriveTypes(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await driveTypeService.getActiveDriveTypes(page, limit);

      const response = createApiResponse(
        true,
        'Active drive types retrieved successfully',
        {
          driveTypes: result.data,
          pagination: result.pagination
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve active drive types',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /drive-types/search - Search drive types
  static async searchDriveTypes(req: Request, res: Response): Promise<void> {
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

      const result = await driveTypeService.searchDriveTypes(query, page, limit);

      const response = createApiResponse(
        true,
        'Drive types search completed',
        {
          driveTypes: result.data,
          pagination: result.pagination,
          query
        }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to search drive types',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /drive-types/stats - Get drive type statistics
  static async getDriveTypeStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await driveTypeService.getStats();

      const response = createApiResponse(
        true,
        'Drive type statistics retrieved successfully',
        stats
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve drive type statistics',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /drive-types/dropdown - Get active drive types for dropdown selection
  static async getDriveTypesDropdown(req: Request, res: Response): Promise<void> {
    try {
      const driveTypes = await driveTypeService.getDropdown();

      const response = createApiResponse(
        true,
        'Active drive types retrieved successfully',
        driveTypes
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve drive types for dropdown',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // GET /drive-types/slug/:slug - Get drive type by slug
  static async getDriveTypeBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const driveType = await driveTypeService.getDriveTypeBySlug(slug);

      const response = createApiResponse(
        true,
        'Drive type retrieved successfully',
        driveType
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve drive type',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // GET /drive-types/:id - Get drive type by ID
  static async getDriveType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const driveType = await driveTypeService.getDriveTypeById(id);

      const response = createApiResponse(
        true,
        'Drive type retrieved successfully',
        driveType
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      const errorResponse = createApiResponse(
        false,
        'Failed to retrieve drive type',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // POST /drive-types - Create new drive type
  static async createDriveType(req: Request, res: Response): Promise<void> {
    try {
      const driveTypeData: CreateDriveTypeRequest = req.body;
      const driveType = await driveTypeService.createDriveType(driveTypeData);

      const response = createApiResponse(
        true,
        'Drive type created successfully',
        driveType
      );

      res.status(201).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && 
        (error.message.includes('already exists') || error.message.includes('duplicate')) ? 409 : 500;
      
      const errorResponse = createApiResponse(
        false,
        'Failed to create drive type',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // PUT /drive-types/:id - Update drive type
  static async updateDriveType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const driveTypeData: UpdateDriveTypeRequest = req.body;
      const driveType = await driveTypeService.updateDriveType(id, driveTypeData);

      const response = createApiResponse(
        true,
        'Drive type updated successfully',
        driveType
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
        'Failed to update drive type',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // PATCH /drive-types/:id/status - Update drive type status
  static async updateDriveTypeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const statusData: UpdateDriveTypeStatusRequest = req.body;
      const driveType = await driveTypeService.updateDriveTypeStatus(id, statusData);

      const response = createApiResponse(
        true,
        'Drive type status updated successfully',
        driveType
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      const errorResponse = createApiResponse(
        false,
        'Failed to update drive type status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }

  // PATCH /drive-types/bulk/status - Bulk update drive type status
  static async bulkUpdateDriveTypeStatus(req: Request, res: Response): Promise<void> {
    try {
      const { ids, active } = req.body;
      const updatedCount = await driveTypeService.bulkUpdateStatus(ids, active);

      const response = createApiResponse(
        true,
        `${updatedCount} drive types updated successfully`,
        { updatedCount, active }
      );

      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Failed to bulk update drive type status',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  // DELETE /drive-types/:id - Delete drive type
  static async deleteDriveType(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await driveTypeService.deleteDriveType(id);

      const response = createApiResponse(
        true,
        'Drive type deleted successfully',
        { deletedId: id }
      );

      res.status(200).json(response);
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
      const errorResponse = createApiResponse(
        false,
        'Failed to delete drive type',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(statusCode).json(errorResponse);
    }
  }
}
