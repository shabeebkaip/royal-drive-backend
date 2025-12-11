import { Request, Response } from 'express';
import { TransmissionService } from '../services/TransmissionService.js';

export class TransmissionController {
  // GET /transmissions - Get all transmissions with filtering and pagination
  static async getAllTransmissions(req: Request, res: Response): Promise<void> {
    try {
      const result = await TransmissionService.getAllTransmissions(req.query);
      
      res.status(200).json({
        success: true,
        message: 'Transmissions retrieved successfully',
        timestamp: new Date().toISOString(),
        data: {
          transmissions: result.data,
          pagination: result.pagination
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve transmissions',
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /transmissions/dropdown - Get active transmissions for dropdown
  static async getActiveTransmissions(req: Request, res: Response): Promise<void> {
    try {
      const transmissions = await TransmissionService.getActiveTransmissions();
      
      res.status(200).json({
        success: true,
        message: 'Active transmissions retrieved successfully',
        timestamp: new Date().toISOString(),
        data: transmissions
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve active transmissions',
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /transmissions/:id - Get transmission by ID
  static async getTransmissionById(req: Request, res: Response): Promise<void> {
    try {
      const transmission = await TransmissionService.getTransmissionById(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Transmission retrieved successfully',
        timestamp: new Date().toISOString(),
        data: transmission
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to retrieve transmission',
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /transmissions/slug/:slug - Get transmission by slug
  static async getTransmissionBySlug(req: Request, res: Response): Promise<void> {
    try {
      const transmission = await TransmissionService.getTransmissionBySlug(req.params.slug);
      
      res.status(200).json({
        success: true,
        message: 'Transmission retrieved successfully',
        timestamp: new Date().toISOString(),
        data: transmission
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to retrieve transmission',
        timestamp: new Date().toISOString()
      });
    }
  }

  // POST /transmissions - Create new transmission
  static async createTransmission(req: Request, res: Response): Promise<void> {
    try {
      const transmission = await TransmissionService.createTransmission(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Transmission created successfully',
        timestamp: new Date().toISOString(),
        data: transmission
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create transmission',
        timestamp: new Date().toISOString()
      });
    }
  }

  // PUT /transmissions/:id - Update transmission
  static async updateTransmission(req: Request, res: Response): Promise<void> {
    try {
      const transmission = await TransmissionService.updateTransmission(req.params.id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Transmission updated successfully',
        timestamp: new Date().toISOString(),
        data: transmission
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update transmission',
        timestamp: new Date().toISOString()
      });
    }
  }

  // PATCH /transmissions/:id/status - Update transmission status
  static async updateTransmissionStatus(req: Request, res: Response): Promise<void> {
    try {
      const transmission = await TransmissionService.updateTransmissionStatus(
        req.params.id,
        req.body.active
      );
      
      res.status(200).json({
        success: true,
        message: 'Transmission status updated successfully',
        timestamp: new Date().toISOString(),
        data: transmission
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update transmission status',
        timestamp: new Date().toISOString()
      });
    }
  }

  // DELETE /transmissions/:id - Delete transmission
  static async deleteTransmission(req: Request, res: Response): Promise<void> {
    try {
      await TransmissionService.deleteTransmission(req.params.id);
      
      res.status(200).json({
        success: true,
        message: 'Transmission deleted successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to delete transmission',
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /transmissions/search - Search transmissions
  static async searchTransmissions(req: Request, res: Response): Promise<void> {
    try {
      const transmissions = await TransmissionService.searchTransmissions(req.query.q as string);
      
      res.status(200).json({
        success: true,
        message: 'Transmissions search results',
        timestamp: new Date().toISOString(),
        data: transmissions
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to search transmissions',
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /transmissions/popular - Get popular transmissions
  static async getPopularTransmissions(req: Request, res: Response): Promise<void> {
    try {
      const transmissions = await TransmissionService.getPopularTransmissions();
      
      res.status(200).json({
        success: true,
        message: 'Popular transmissions retrieved successfully',
        timestamp: new Date().toISOString(),
        data: transmissions
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve popular transmissions',
        timestamp: new Date().toISOString()
      });
    }
  }

  // GET /transmissions/stats - Get transmission statistics
  static async getTransmissionStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await TransmissionService.getTransmissionStats();
      
      res.status(200).json({
        success: true,
        message: 'Transmission statistics retrieved successfully',
        timestamp: new Date().toISOString(),
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve transmission statistics',
        timestamp: new Date().toISOString()
      });
    }
  }
}
