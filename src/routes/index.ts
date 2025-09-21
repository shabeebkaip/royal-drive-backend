import express, { Router } from 'express';
import { ExampleController } from '../controllers/ExampleController.js';
import { vehicleRoutes } from './vehicleRoutes.js';
import { makeRoutes } from './makeRoutes.js';
import { vehicleTypeRoutes } from './vehicleTypeRoutes.js';
import { modelRoutes } from './modelRoutes.js';
import fuelTypeRoutes from './fuelTypeRoutes.js';
import transmissionRoutes from './transmissionRoutes.js';
import { driveTypeRoutes } from './driveTypeRoutes.js';
import { statusRoutes } from './statusRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const router: Router = express.Router();

// Health check route
router.get('/health', ExampleController.getHealth);

// API info route
router.get('/info', ExampleController.getInfo);

// Vehicle routes
router.use('/vehicles', vehicleRoutes);

// Make routes
router.use('/makes', makeRoutes);

// Vehicle Type routes
router.use('/vehicle-types', vehicleTypeRoutes);

// Model routes
router.use('/models', modelRoutes);

// Fuel Type routes
router.use('/fuel-types', fuelTypeRoutes);

// Transmission routes
router.use('/transmissions', transmissionRoutes);

// Drive Type routes
router.use('/drive-types', driveTypeRoutes);

// Status routes
router.use('/statuses', statusRoutes);

// Upload routes
router.use('/uploads', uploadRoutes);

// Export the router
export { router as apiRoutes };
