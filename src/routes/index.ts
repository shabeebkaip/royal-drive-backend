import express, { Router } from 'express';
import { ExampleController } from '../controllers/ExampleController.js';
import { vehicleRoutes } from './vehicleRoutes.js';
import { makeRoutes } from './makeRoutes.js';
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

// Upload routes
router.use('/uploads', uploadRoutes);

// Export the router
export { router as apiRoutes };
