import { Router } from 'express';
import { DriveTypeController } from '@/controllers/DriveTypeController';
import {
  validateDriveType,
  validateDriveTypeUpdate,
  validateDriveTypeStatus,
  validateBulkStatusUpdate,
  handleValidationErrors
} from '@/middleware/driveTypeValidation';

const router: Router = Router();

// GET /drive-types - Get all drive types with filtering and pagination
router.get('/', DriveTypeController.getAllDriveTypes);

// GET /drive-types/active - Get active drive types
router.get('/active', DriveTypeController.getActiveDriveTypes);

// GET /drive-types/search - Search drive types
router.get('/search', DriveTypeController.searchDriveTypes);

// GET /drive-types/stats - Get drive type statistics
router.get('/stats', DriveTypeController.getDriveTypeStats);

// GET /drive-types/dropdown - Get active drive types for dropdown selection
router.get('/dropdown', DriveTypeController.getDriveTypesDropdown);

// GET /drive-types/slug/:slug - Get drive type by slug
router.get('/slug/:slug', DriveTypeController.getDriveTypeBySlug);

// GET /drive-types/:id - Get drive type by ID
router.get('/:id', DriveTypeController.getDriveType);

// POST /drive-types - Create new drive type
router.post('/', validateDriveType, handleValidationErrors, DriveTypeController.createDriveType);

// PUT /drive-types/:id - Update drive type
router.put('/:id', validateDriveTypeUpdate, handleValidationErrors, DriveTypeController.updateDriveType);

// PATCH /drive-types/:id/status - Update drive type status
router.patch('/:id/status', validateDriveTypeStatus, handleValidationErrors, DriveTypeController.updateDriveTypeStatus);

// PATCH /drive-types/bulk/status - Bulk update drive type status
router.patch('/bulk/status', validateBulkStatusUpdate, handleValidationErrors, DriveTypeController.bulkUpdateDriveTypeStatus);

// DELETE /drive-types/:id - Delete drive type
router.delete('/:id', DriveTypeController.deleteDriveType);

export { router as driveTypeRoutes };
