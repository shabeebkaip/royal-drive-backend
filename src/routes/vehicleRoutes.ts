import express, { Router } from 'express';
import { VehicleController } from '../controllers/VehicleController';
import { validateVehicle, validateVehicleUpdate } from '../middleware/validation';
import { optionalAuthenticate } from '../middleware/auth';

const router: Router = express.Router();

// GET /vehicles - Get all vehicles with filtering and pagination
router.get('/', VehicleController.getAllVehicles);

// GET /vehicles/search - Search vehicles
router.get('/search', VehicleController.searchVehicles);

// GET /vehicles/featured - Get featured vehicles
router.get('/featured', VehicleController.getFeaturedVehicles);



// GET /vehicles/:id - Get vehicle by ID, VIN, or stock number (optional auth to include internal fields)
router.get('/:id', optionalAuthenticate, VehicleController.getVehicle);

// POST /vehicles - Create new vehicle
router.post('/', validateVehicle, VehicleController.createVehicle);

// PUT /vehicles/:id - Update vehicle
router.put('/:id', validateVehicleUpdate, VehicleController.updateVehicle);

// PATCH /vehicles/:id/status - Update vehicle status
router.patch('/:id/status', VehicleController.updateVehicleStatus);

// DELETE /vehicles/:id - Delete vehicle
router.delete('/:id', VehicleController.deleteVehicle);

export { router as vehicleRoutes };
