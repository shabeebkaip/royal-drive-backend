import express, { Router } from 'express';
import { ExampleController } from '../controllers/ExampleController.js';
import { vehicleRoutes } from './vehicleRoutes.js';

const router: Router = express.Router();

// Health check route
router.get('/health', ExampleController.getHealth);

// API info route
router.get('/info', ExampleController.getInfo);

// Vehicle routes
router.use('/vehicles', vehicleRoutes);

// Export the router
export { router as apiRoutes };
