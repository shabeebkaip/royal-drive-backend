import { Router } from 'express';
import { VehicleEnquiryController } from '../controllers/VehicleEnquiryController';
import { authenticate, requireRole } from '../middleware/auth';
import {
  validateCreateEnquiry,
  validateUpdateEnquiry,
  validateGetEnquiryById,
  validateDeleteEnquiry,
  validateGetEnquiriesByVehicle,
  validateAssignEnquiry,
  validateAddContactHistory,
  validateEnquiryQuery
} from '../middleware/vehicleEnquiryValidation';

const router: Router = Router();

// Public routes (no authentication required)
/**
 * @route   POST /api/v1/enquiries
 * @desc    Create a new vehicle enquiry
 * @access  Public
 */
router.post('/', validateCreateEnquiry, VehicleEnquiryController.createEnquiry);

// Admin routes (authentication and authorization required)
/**
 * @route   GET /api/v1/enquiries/stats
 * @desc    Get enquiry statistics for dashboard
 * @access  Admin only
 */
router.get('/stats', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  VehicleEnquiryController.getEnquiryStats
);

/**
 * @route   GET /api/v1/enquiries/my-assignments
 * @desc    Get enquiries assigned to current user
 * @access  Admin/Manager/Salesperson
 */
router.get('/my-assignments', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager', 'salesperson'),
  VehicleEnquiryController.getMyAssignments
);

/**
 * @route   GET /api/v1/enquiries/vehicle/:vehicleId
 * @desc    Get all enquiries for a specific vehicle
 * @access  Admin only
 */
router.get('/vehicle/:vehicleId', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  validateGetEnquiriesByVehicle,
  VehicleEnquiryController.getEnquiriesByVehicle
);

/**
 * @route   GET /api/v1/enquiries
 * @desc    Get all enquiries with filtering and pagination
 * @access  Admin only
 */
router.get('/', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  validateEnquiryQuery,
  VehicleEnquiryController.getEnquiries
);

/**
 * @route   GET /api/v1/enquiries/:id
 * @desc    Get a single enquiry by ID
 * @access  Admin only
 */
router.get('/:id', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager', 'salesperson'),
  validateGetEnquiryById,
  VehicleEnquiryController.getEnquiryById
);

/**
 * @route   PUT /api/v1/enquiries/:id
 * @desc    Update an enquiry
 * @access  Admin only
 */
router.put('/:id', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager', 'salesperson'),
  validateUpdateEnquiry,
  VehicleEnquiryController.updateEnquiry
);

/**
 * @route   PUT /api/v1/enquiries/:id/assign
 * @desc    Assign an enquiry to a user
 * @access  Admin/Manager only
 */
router.put('/:id/assign', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager'),
  validateAssignEnquiry,
  VehicleEnquiryController.assignEnquiry
);

/**
 * @route   POST /api/v1/enquiries/:id/contact
 * @desc    Add contact history to an enquiry
 * @access  Admin/Manager/Salesperson
 */
router.post('/:id/contact', 
  authenticate, 
  requireRole('superAdmin', 'admin', 'manager', 'salesperson'),
  validateAddContactHistory,
  VehicleEnquiryController.addContactHistory
);

/**
 * @route   DELETE /api/v1/enquiries/:id
 * @desc    Delete an enquiry
 * @access  Admin only
 */
router.delete('/:id', 
  authenticate, 
  requireRole('superAdmin', 'admin'),
  validateDeleteEnquiry,
  VehicleEnquiryController.deleteEnquiry
);

export default router;
