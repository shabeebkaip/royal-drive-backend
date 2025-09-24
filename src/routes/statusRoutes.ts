import { Router } from 'express';
import { StatusController } from '@/controllers/StatusController';
import {
  validateStatus,
  validateStatusUpdate,
  validateStatusStatus,
  validateBulkStatusUpdate,
  handleValidationErrors
} from '@/middleware/statusValidation';

const router: Router = Router();

// GET /statuses - Get all statuses with filtering and pagination
router.get('/', StatusController.getAllStatuses);

// GET /statuses/active - Get active statuses
router.get('/active', StatusController.getActiveStatuses);

// GET /statuses/search - Search statuses
router.get('/search', StatusController.searchStatuses);

// GET /statuses/stats - Get status statistics
router.get('/stats', StatusController.getStatusStats);

// GET /statuses/dropdown - Get active statuses for dropdown selection
router.get('/dropdown', StatusController.getStatusesDropdown);

// GET /statuses/default - Get default status
router.get('/default', StatusController.getDefaultStatus);

// GET /statuses/slug/:slug - Get status by slug
router.get('/slug/:slug', StatusController.getStatusBySlug);

// GET /statuses/:id - Get status by ID
router.get('/:id', StatusController.getStatus);

// POST /statuses - Create new status
router.post('/', validateStatus, handleValidationErrors, StatusController.createStatus);

// PUT /statuses/:id - Update status
router.put('/:id', validateStatusUpdate, handleValidationErrors, StatusController.updateStatus);

// PATCH /statuses/:id/status - Update status active state
router.patch('/:id/status', validateStatusStatus, handleValidationErrors, StatusController.updateStatusStatus);

// PATCH /statuses/:id/default - Set as default status
router.patch('/:id/default', StatusController.setDefaultStatus);

// PATCH /statuses/bulk/status - Bulk update status active state
router.patch('/bulk/status', validateBulkStatusUpdate, handleValidationErrors, StatusController.bulkUpdateStatusStatus);

// DELETE /statuses/:id - Delete status
router.delete('/:id', StatusController.deleteStatus);

export { router as statusRoutes };
