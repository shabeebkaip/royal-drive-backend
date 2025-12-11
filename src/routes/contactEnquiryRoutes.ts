import { Router } from 'express';
import { ContactEnquiryController } from '../controllers/ContactEnquiryController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  validateCreateContactEnquiry,
  validateUpdateContactEnquiry,
  validateEnquiryId,
  validateGetEnquiries,
  validateAssignEnquiry,
  validateAddNote
} from '../middleware/contactEnquiryValidation.js';

const router: Router = Router();

// Public routes (no authentication required)
/**
 * @route   POST /api/v1/contact-enquiries
 * @desc    Create a new contact enquiry from contact form
 * @access  Public
 */
router.post('/', validateCreateContactEnquiry, ContactEnquiryController.createEnquiry);

// Admin routes (authentication and authorization required)
/**
 * @route   GET /api/v1/contact-enquiries/stats
 * @desc    Get contact enquiry statistics for dashboard
 * @access  Admin only
 */
router.get('/stats', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  ContactEnquiryController.getStats
);

/**
 * @route   GET /api/v1/contact-enquiries
 * @desc    Get all contact enquiries with filtering and pagination
 * @access  Admin only
 */
router.get('/', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  validateGetEnquiries,
  ContactEnquiryController.getEnquiries
);

/**
 * @route   GET /api/v1/contact-enquiries/:id
 * @desc    Get a single contact enquiry by ID
 * @access  Admin only
 */
router.get('/:id', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  validateEnquiryId,
  ContactEnquiryController.getEnquiryById
);

/**
 * @route   PUT /api/v1/contact-enquiries/:id
 * @desc    Update a contact enquiry (status, priority, notes, etc.)
 * @access  Admin only
 */
router.put('/:id', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  validateUpdateContactEnquiry,
  ContactEnquiryController.updateEnquiry
);

/**
 * @route   DELETE /api/v1/contact-enquiries/:id
 * @desc    Delete a contact enquiry
 * @access  Admin only
 */
router.delete('/:id', 
  authenticate, 
  requireRole('superAdmin', 'admin'),
  validateEnquiryId,
  ContactEnquiryController.deleteEnquiry
);

/**
 * @route   POST /api/v1/contact-enquiries/:id/assign
 * @desc    Assign contact enquiry to admin user
 * @access  Admin only
 */
router.post('/:id/assign', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  validateAssignEnquiry,
  ContactEnquiryController.assignEnquiry
);

/**
 * @route   POST /api/v1/contact-enquiries/:id/notes
 * @desc    Add note to contact enquiry
 * @access  Admin only
 */
router.post('/:id/notes', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  validateAddNote,
  ContactEnquiryController.addNote
);

/**
 * @route   POST /api/v1/contact-enquiries/:id/resolve
 * @desc    Mark contact enquiry as resolved
 * @access  Admin only
 */
router.post('/:id/resolve', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  validateEnquiryId,
  ContactEnquiryController.markAsResolved
);

export default router;
