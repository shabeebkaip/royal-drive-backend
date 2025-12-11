import express, { Router } from 'express';
import { VehicleTypeController } from '../controllers/VehicleTypeController.js';
import { validateVehicleType, validateVehicleTypeUpdate } from '../middleware/vehicleTypeValidation.js';

const router: Router = express.Router();

// GET /vehicle-types - Get all vehicle types with filtering and pagination
router.get('/', VehicleTypeController.getAllVehicleTypes);

// GET /vehicle-types/search - Search vehicle types
router.get('/search', VehicleTypeController.searchVehicleTypes);

// GET /vehicle-types/active - Get active vehicle types
router.get('/active', VehicleTypeController.getActiveVehicleTypes);

// GET /vehicle-types/popular - Get popular vehicle types
router.get('/popular', VehicleTypeController.getPopularVehicleTypes);

// GET /vehicle-types/stats - Get vehicle type statistics
router.get('/stats', VehicleTypeController.getVehicleTypeStats);

// GET /vehicle-types/dropdown - Get active vehicle types for dropdown
router.get('/dropdown', VehicleTypeController.getVehicleTypesDropdown);

// GET /vehicle-types/slug/:slug - Get vehicle type by slug
router.get('/slug/:slug', VehicleTypeController.getVehicleTypeBySlug);

// GET /vehicle-types/:id - Get vehicle type by ID
router.get('/:id', VehicleTypeController.getVehicleType);

// POST /vehicle-types - Create new vehicle type
router.post('/', validateVehicleType, VehicleTypeController.createVehicleType);

// PUT /vehicle-types/:id - Update vehicle type
router.put('/:id', validateVehicleTypeUpdate, VehicleTypeController.updateVehicleType);

// PATCH /vehicle-types/:id/status - Update vehicle type status
router.patch('/:id/status', VehicleTypeController.updateVehicleTypeStatus);

// DELETE /vehicle-types/:id - Delete vehicle type
router.delete('/:id', VehicleTypeController.deleteVehicleType);

export { router as vehicleTypeRoutes };
