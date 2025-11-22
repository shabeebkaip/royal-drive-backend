import { Request, Response } from 'express';
import { ContactEnquiryService } from '../services/ContactEnquiryService';
import { IContactEnquiryCreateRequest, IContactEnquiryUpdateRequest } from '../types/contactEnquiry.d';
import { validationResult } from 'express-validator';

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class ContactEnquiryController {

  /**
   * Create a new contact enquiry (Public endpoint)
   * POST /api/v1/contact-enquiries
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

      const enquiryData: IContactEnquiryCreateRequest = req.body;
      const enquiry = await ContactEnquiryService.createEnquiry(enquiryData);

      return res.status(201).json({
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        data: {
          enquiryId: enquiry._id,
          status: enquiry.status,
          createdAt: enquiry.createdAt
        }
      });
    } catch (error: any) {
      console.error('Error creating contact enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to submit your enquiry. Please try again.',
        error: error.message
      });
    }
  }

  /**
   * Get all contact enquiries with filtering and pagination (Admin only)
   * GET /api/v1/contact-enquiries
   */
  static async getEnquiries(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const result = await ContactEnquiryService.getEnquiries(req.query);

      return res.status(200).json({
        success: true,
        message: 'Contact enquiries retrieved successfully',
        data: result.enquiries,
        pagination: result.pagination
      });
    } catch (error: any) {
      console.error('Error fetching contact enquiries:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contact enquiries',
        error: error.message
      });
    }
  }

  /**
   * Get a single contact enquiry by ID (Admin only)
   * GET /api/v1/contact-enquiries/:id
   */
  static async getEnquiryById(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const enquiry = await ContactEnquiryService.getEnquiryById(req.params.id);

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Contact enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Contact enquiry retrieved successfully',
        data: enquiry
      });
    } catch (error: any) {
      console.error('Error fetching contact enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contact enquiry',
        error: error.message
      });
    }
  }

  /**
   * Update a contact enquiry (Admin only)
   * PUT /api/v1/contact-enquiries/:id
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

      const updateData: IContactEnquiryUpdateRequest = req.body;
      const userId = req.user?.id;

      const enquiry = await ContactEnquiryService.updateEnquiry(
        req.params.id,
        updateData,
        userId
      );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Contact enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Contact enquiry updated successfully',
        data: enquiry
      });
    } catch (error: any) {
      console.error('Error updating contact enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update contact enquiry',
        error: error.message
      });
    }
  }

  /**
   * Delete a contact enquiry (Admin only)
   * DELETE /api/v1/contact-enquiries/:id
   */
  static async deleteEnquiry(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const deleted = await ContactEnquiryService.deleteEnquiry(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Contact enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Contact enquiry deleted successfully'
      });
    } catch (error: any) {
      console.error('Error deleting contact enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete contact enquiry',
        error: error.message
      });
    }
  }

  /**
   * Get contact enquiry statistics (Admin only)
   * GET /api/v1/contact-enquiries/stats
   */
  static async getStats(req: Request, res: Response): Promise<Response> {
    try {
      const stats = await ContactEnquiryService.getStats();

      return res.status(200).json({
        success: true,
        message: 'Contact enquiry statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Error fetching contact enquiry stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch contact enquiry statistics',
        error: error.message
      });
    }
  }

  /**
   * Assign contact enquiry to admin user (Admin only)
   * POST /api/v1/contact-enquiries/:id/assign
   */
  static async assignEnquiry(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const enquiry = await ContactEnquiryService.assignEnquiry(
        req.params.id,
        req.body.adminUserId
      );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Contact enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Contact enquiry assigned successfully',
        data: enquiry
      });
    } catch (error: any) {
      console.error('Error assigning contact enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to assign contact enquiry',
        error: error.message
      });
    }
  }

  /**
   * Add note to contact enquiry (Admin only)
   * POST /api/v1/contact-enquiries/:id/notes
   */
  static async addNote(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const enquiry = await ContactEnquiryService.addNote(
        req.params.id,
        req.body.content,
        userId
      );

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Contact enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Note added successfully',
        data: enquiry
      });
    } catch (error: any) {
      console.error('Error adding note to contact enquiry:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to add note',
        error: error.message
      });
    }
  }

  /**
   * Mark contact enquiry as resolved (Admin only)
   * POST /api/v1/contact-enquiries/:id/resolve
   */
  static async markAsResolved(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const enquiry = await ContactEnquiryService.markAsResolved(req.params.id, userId);

      if (!enquiry) {
        return res.status(404).json({
          success: false,
          message: 'Contact enquiry not found'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Contact enquiry marked as resolved',
        data: enquiry
      });
    } catch (error: any) {
      console.error('Error marking contact enquiry as resolved:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to mark enquiry as resolved',
        error: error.message
      });
    }
  }
}
