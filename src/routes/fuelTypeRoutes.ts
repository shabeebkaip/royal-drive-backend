import { Router, Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { FuelTypeController } from '../controllers/FuelTypeController.js';
import {
  validateCreateFuelType,
  validateUpdateFuelType,
  validateUpdateFuelTypeStatus,
  validateGetFuelTypeById,
  validateGetFuelTypeBySlug,
  validateSearchFuelTypes,
  validateListFuelTypes
} from '../middleware/fuelTypeValidation.js';

// Validation error handler
const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: (err as any).param,
        message: err.msg
      })),
      timestamp: new Date().toISOString()
    });
    return;
  }
  next();
};

const router: Router = Router();
const fuelTypeController = new FuelTypeController();

// GET /fuel-types - Get all fuel types with filtering and pagination
router.get(
  '/',
  validateListFuelTypes,
  handleValidationErrors,
  fuelTypeController.getAllFuelTypes
);

// GET /fuel-types/dropdown - Get active fuel types for dropdown
router.get(
  '/dropdown',
  fuelTypeController.getActiveFuelTypes
);

// GET /fuel-types/search - Search fuel types
router.get(
  '/search',
  validateSearchFuelTypes,
  handleValidationErrors,
  fuelTypeController.searchFuelTypes
);

// GET /fuel-types/popular - Get popular fuel types
router.get(
  '/popular',
  fuelTypeController.getPopularFuelTypes
);

// GET /fuel-types/stats - Get fuel type statistics
router.get(
  '/stats',
  fuelTypeController.getFuelTypeStatistics
);

// GET /fuel-types/:id - Get fuel type by ID
router.get(
  '/:id',
  validateGetFuelTypeById,
  handleValidationErrors,
  fuelTypeController.getFuelTypeById
);

// GET /fuel-types/slug/:slug - Get fuel type by slug
router.get(
  '/slug/:slug',
  validateGetFuelTypeBySlug,
  handleValidationErrors,
  fuelTypeController.getFuelTypeBySlug
);

// POST /fuel-types - Create new fuel type
router.post(
  '/',
  validateCreateFuelType,
  handleValidationErrors,
  fuelTypeController.createFuelType
);

// PUT /fuel-types/:id - Update fuel type
router.put(
  '/:id',
  validateUpdateFuelType,
  handleValidationErrors,
  fuelTypeController.updateFuelType
);

// PATCH /fuel-types/:id/status - Update fuel type status
router.patch(
  '/:id/status',
  validateUpdateFuelTypeStatus,
  handleValidationErrors,
  fuelTypeController.updateFuelTypeStatus
);

// DELETE /fuel-types/:id - Delete fuel type
router.delete(
  '/:id',
  validateGetFuelTypeById,
  handleValidationErrors,
  fuelTypeController.deleteFuelType
);

export default router;
