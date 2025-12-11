import { Router } from 'express';
import { CarSubmissionController } from '../controllers/CarSubmissionController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  validateCreateCarSubmission,
  validateUpdateCarSubmission,
  validateAssignCarSubmission,
  validateAddContactHistoryCarSubmission,
  validateCarSubmissionQuery
} from '../middleware/carSubmissionValidation.js';

// Roles allowed to manage submissions
const MANAGEMENT_ROLES = ['superAdmin', 'admin', 'manager', 'salesperson'] as const;
const ADMIN_ROLES = ['superAdmin', 'admin', 'manager'] as const;

const router: Router = Router();

// Public create endpoint
router.post('/', validateCreateCarSubmission, CarSubmissionController.createSubmission);

// Protected routes
router.use(authenticate);

router.get('/', requireRole(...MANAGEMENT_ROLES), validateCarSubmissionQuery, CarSubmissionController.getSubmissions);
router.get('/stats', requireRole(...ADMIN_ROLES), CarSubmissionController.getSubmissionStats);
router.get('/my-assignments', requireRole(...MANAGEMENT_ROLES), CarSubmissionController.getMyAssignments);
router.get('/attention', requireRole(...MANAGEMENT_ROLES), CarSubmissionController.getAttentionList);
router.get('/search/owner', requireRole(...MANAGEMENT_ROLES), CarSubmissionController.searchByOwner);
router.get('/:id', requireRole(...MANAGEMENT_ROLES), CarSubmissionController.getSubmissionById);
router.put('/:id', requireRole(...MANAGEMENT_ROLES), validateUpdateCarSubmission, CarSubmissionController.updateSubmission);
router.delete('/:id', requireRole('superAdmin', 'admin'), CarSubmissionController.deleteSubmission);
router.put('/:id/assign', requireRole(...ADMIN_ROLES), validateAssignCarSubmission, CarSubmissionController.assignSubmission);
router.post('/:id/contact', requireRole(...MANAGEMENT_ROLES), validateAddContactHistoryCarSubmission, CarSubmissionController.addContactHistory);

export default router;
