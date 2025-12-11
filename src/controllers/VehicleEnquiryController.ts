import { Request, Response } from 'express';
import { VehicleEnquiryService } from '../services/VehicleEnquiryService.js';
import type { IVehicleEnquiryCreateRequest, IVehicleEnquiryUpdateRequest } from '../types/vehicleEnquiry.d.js';
import { validationResult } from 'express-validator';

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class VehicleEnquiryController {

  /**
   * Create a new vehicle enquiry (Public endpoint)
   * POST /api/v1/enquiries
   */
  static async createEnquiry(req: Request, res: Response): Promise<Response> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const enquiryData: IVehicleEnquiryCreateRequest = req.body;
      const enquiry = await VehicleEnquiryService.createEnquiry(enquiryData);

      return res.status(201).json({
        success: true,
        message: 'Enquiry submitted successfully. We will contact you soon!',
        data: {
          enquiryId: enquiry._id,
          status: enquiry.status,
          createdAt: enquiry.createdAt
        }
      });
    } catch (error: any) {
      console.error('Error creating vehicle enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit enquiry. Please try again.',
        error: error.message
      });
    }
  }

  /**
   * Get all enquiries with filtering and pagination (Admin only)
   * GET /api/v1/enquiries
   */
  static async getEnquiries(req: Request, res: Response): Promise<Response> {
    try {
      const result = await VehicleEnquiryService.getEnquiries(req.query);

      return res.status(200).json({
        success: true,
        message: 'Enquiries retrieved successfully',
        data: result.enquiries,
        pagination: result.pagination
      });
    } catch (error: any) {
      console.error('Error fetching enquiries:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch enquiries',
        error: error.message
      });
    }
  }

  /**
   * Get a single enquiry by ID (Admin only)
   * GET /api/v1/enquiries/:id
   */
  static async getEnquiryById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const enquiry = await VehicleEnquiryService.getEnquiryById(id);

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Enquiry retrieved successfully',
        data: enquiry
      });
    } catch (error: any) {
      console.error('Error fetching enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch enquiry',
        error: error.message
      });
    }
  }

  /**
   * Update an enquiry (Admin only)
   * PUT /api/v1/enquiries/:id
   */
  static async updateEnquiry(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const updateData: IVehicleEnquiryUpdateRequest = req.body;
      const updatedBy = req.user?.id; // From auth middleware

      const updatedEnquiry = await VehicleEnquiryService.updateEnquiry(id, updateData, updatedBy);

      if (!updatedEnquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Enquiry updated successfully',
        data: updatedEnquiry
      });
    } catch (error: any) {
      console.error('Error updating enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update enquiry',
        error: error.message
      });
    }
  }

  /**
   * Delete an enquiry (Admin only)
   * DELETE /api/v1/enquiries/:id
   */
  static async deleteEnquiry(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await VehicleEnquiryService.deleteEnquiry(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Enquiry deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete enquiry',
        error: error.message
      });
    }
  }

  /**
   * Get enquiry statistics for admin dashboard
   * GET /api/v1/enquiries/stats
   */
  static async getEnquiryStats(req: Request, res: Response): Promise<Response> {
    try {
      const stats = await VehicleEnquiryService.getEnquiryStats();

      return res.status(200).json({
        success: true,
        message: 'Enquiry statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Error fetching enquiry stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch enquiry statistics',
        error: error.message
      });
    }
  }

  /**
   * Get enquiries for a specific vehicle (Admin only)
   * GET /api/v1/enquiries/vehicle/:vehicleId
   */
  static async getEnquiriesByVehicle(req: Request, res: Response): Promise<Response> {
    try {
      const { vehicleId } = req.params;
      const enquiries = await VehicleEnquiryService.getEnquiriesByVehicle(vehicleId);

      return res.status(200).json({
        success: true,
        message: 'Vehicle enquiries retrieved successfully',
        data: enquiries
      });
    } catch (error: any) {
      console.error('Error fetching vehicle enquiries:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch vehicle enquiries',
        error: error.message
      });
    }
  }

  /**
   * Get enquiries assigned to current user (Admin only)
   * GET /api/v1/enquiries/my-assignments
   */
  static async getMyAssignments(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const enquiries = await VehicleEnquiryService.getEnquiriesByAssignee(userId);

      return res.status(200).json({
        success: true,
        message: 'Your assigned enquiries retrieved successfully',
        data: enquiries
      });
    } catch (error: any) {
      console.error('Error fetching assigned enquiries:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch assigned enquiries',
        error: error.message
      });
    }
  }

  /**
   * Assign enquiry to a user (Admin only)
   * PUT /api/v1/enquiries/:id/assign
   */
  static async assignEnquiry(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { assignedTo } = req.body;

      const updatedEnquiry = await VehicleEnquiryService.updateEnquiry(id, { assignedTo });

      if (!updatedEnquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Enquiry assigned successfully',
        data: updatedEnquiry
      });
    } catch (error: any) {
      console.error('Error assigning enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to assign enquiry',
        error: error.message
      });
    }
  }

  /**
   * Add contact history to an enquiry (Admin only)
   * POST /api/v1/enquiries/:id/contact
   */
  static async addContactHistory(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { method, notes } = req.body;
      const updatedBy = req.user?.id;

      const updatedEnquiry = await VehicleEnquiryService.updateEnquiry(
        id, 
        { contactHistory: { method, notes } },
        updatedBy
      );

      if (!updatedEnquiry) {
        return res.status(404).json({
          success: false,
          message: 'Enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Contact history added successfully',
        data: updatedEnquiry
      });
    } catch (error: any) {
      console.error('Error adding contact history:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to add contact history',
        error: error.message
      });
    }
  }
}
