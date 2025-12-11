import { Request, Response } from 'express';
import { CarSubmissionService } from '../services/CarSubmissionService.js';
import { validationResult } from 'express-validator';
import { ICarSubmissionCreateRequest, ICarSubmissionUpdateRequest } from '../types/carSubmission.d.js';
import { AuthenticatedRequest } from '../types/user.d.js';

export class CarSubmissionController {
  /**
   * Public endpoint: Create a new car submission (Sell Your Car form)
   * POST /api/v1/car-submissions
   */
  static async createSubmission(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      }

      const data: ICarSubmissionCreateRequest = req.body;
      const submission = await CarSubmissionService.createSubmission(data);

      return res.status(201).json({
        success: true,
        message: 'Submission received. Our team will contact you soon.',
        data: { id: submission._id, status: submission.status, createdAt: submission.createdAt }
      });
    } catch (error: any) {
      console.error('Error creating car submission:', error);
      return res.status(500).json({ success: false, message: 'Failed to submit. Please try again.', error: error.message });
    }
  }

  /**
   * Get submissions with filters & pagination (Protected)
   * GET /api/v1/car-submissions
   */
  static async getSubmissions(req: Request, res: Response): Promise<Response> {
    try {
      const result = await CarSubmissionService.getSubmissions(req.query as any);
      return res.status(200).json({ success: true, message: 'Submissions retrieved', data: result.submissions, pagination: result.pagination });
    } catch (error: any) {
      console.error('Error fetching car submissions:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch submissions', error: error.message });
    }
  }

  /**
   * Get one submission by ID (Protected)
   * GET /api/v1/car-submissions/:id
   */
  static async getSubmissionById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const submission = await CarSubmissionService.getSubmissionById(id);
      if (!submission) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }
      return res.status(200).json({ success: true, message: 'Submission retrieved', data: submission });
    } catch (error: any) {
      console.error('Error fetching car submission:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch submission', error: error.message });
    }
  }

  /**
   * Update a submission (status / assignment / evaluation / inspection / offer / notes)
   * PUT /api/v1/car-submissions/:id
   */
  static async updateSubmission(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      }

      const { id } = req.params;
      const updateData: ICarSubmissionUpdateRequest = req.body;
      const updated = await CarSubmissionService.updateSubmission(id, updateData, req.user?._id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }
      return res.status(200).json({ success: true, message: 'Submission updated', data: updated });
    } catch (error: any) {
      console.error('Error updating car submission:', error);
      return res.status(500).json({ success: false, message: 'Failed to update submission', error: error.message });
    }
  }

  /**
   * Delete a submission (Admin only)
   * DELETE /api/v1/car-submissions/:id
   */
  static async deleteSubmission(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await CarSubmissionService.deleteSubmission(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }
      return res.status(200).json({ success: true, message: 'Submission deleted' });
    } catch (error: any) {
      console.error('Error deleting car submission:', error);
      return res.status(500).json({ success: false, message: 'Failed to delete submission', error: error.message });
    }
  }

  /**
   * Stats for dashboard
   * GET /api/v1/car-submissions/stats
   */
  static async getSubmissionStats(_req: Request, res: Response): Promise<Response> {
    try {
      const stats = await CarSubmissionService.getSubmissionStats();
      return res.status(200).json({ success: true, message: 'Stats retrieved', data: stats });
    } catch (error: any) {
      console.error('Error fetching submission stats:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch stats', error: error.message });
    }
  }

  /**
   * Assign a submission
   * PUT /api/v1/car-submissions/:id/assign
   */
  static async assignSubmission(req: Request, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      }
      const { id } = req.params;
      const { assignedTo } = req.body;
      const updated = await CarSubmissionService.updateSubmission(id, { assignedTo });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }
      return res.status(200).json({ success: true, message: 'Submission assigned', data: updated });
    } catch (error: any) {
      console.error('Error assigning car submission:', error);
      return res.status(500).json({ success: false, message: 'Failed to assign submission', error: error.message });
    }
  }

  /**
   * Add contact history
   * POST /api/v1/car-submissions/:id/contact
   */
  static async addContactHistory(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      }
      const { id } = req.params;
      const { method, notes } = req.body;
      const updated = await CarSubmissionService.updateSubmission(id, { contactHistory: { method, notes } }, req.user?._id);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Submission not found' });
      }
      return res.status(200).json({ success: true, message: 'Contact history added', data: updated });
    } catch (error: any) {
      console.error('Error adding contact history:', error);
      return res.status(500).json({ success: false, message: 'Failed to add contact history', error: error.message });
    }
  }

  /**
   * Current user assignments
   * GET /api/v1/car-submissions/my-assignments
   */
  static async getMyAssignments(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }
      const submissions = await CarSubmissionService.getSubmissionsByAssignee(req.user._id);
      return res.status(200).json({ success: true, message: 'Your assignments retrieved', data: submissions });
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch assignments', error: error.message });
    }
  }

  /**
   * Submissions needing attention
   * GET /api/v1/car-submissions/attention
   */
  static async getAttentionList(_req: Request, res: Response): Promise<Response> {
    try {
      const submissions = await CarSubmissionService.getSubmissionsNeedingAttention();
      return res.status(200).json({ success: true, message: 'Attention list retrieved', data: submissions });
    } catch (error: any) {
      console.error('Error fetching attention list:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch attention list', error: error.message });
    }
  }

  /**
   * Search by owner
   * GET /api/v1/car-submissions/search/owner?term=
   */
  static async searchByOwner(req: Request, res: Response): Promise<Response> {
    try {
      const term = (req.query.term as string) || '';
      if (!term || term.length < 2) {
        return res.status(400).json({ success: false, message: 'Search term must be at least 2 characters' });
      }
      const results = await CarSubmissionService.searchByOwner(term);
      return res.status(200).json({ success: true, message: 'Owner search results', data: results });
    } catch (error: any) {
      console.error('Error searching by owner:', error);
      return res.status(500).json({ success: false, message: 'Failed to search owners', error: error.message });
    }
  }
}
