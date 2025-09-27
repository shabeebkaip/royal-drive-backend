import express, { Router } from 'express';
import { ExampleController } from '../controllers/ExampleController';
import { vehicleRoutes } from './vehicleRoutes';
import { makeRoutes } from './makeRoutes';
import { vehicleTypeRoutes } from './vehicleTypeRoutes';
import { modelRoutes } from './modelRoutes';
import fuelTypeRoutes from './fuelTypeRoutes';
import transmissionRoutes from './transmissionRoutes';
import { driveTypeRoutes } from './driveTypeRoutes';
import { statusRoutes } from './statusRoutes';
import uploadRoutes from './uploadRoutes';
import { authRoutes } from './authRoutes';
import vehicleEnquiryRoutes from './vehicleEnquiryRoutes';
import carSubmissionRoutes from './carSubmissionRoutes';
import analyticsRoutes from './analyticsRoutes';
import salesTransactionRoutes from './salesTransactionRoutes';

const router: Router = express.Router();

// Health check route
router.get('/health', ExampleController.getHealth);

// API info route
router.get('/info', ExampleController.getInfo);

// Authentication routes
router.use('/auth', authRoutes);

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

// Vehicle Enquiry routes
router.use('/enquiries', vehicleEnquiryRoutes);

// Car Submission (Sell Your Car) routes
router.use('/car-submissions', carSubmissionRoutes);

// Analytics / Dashboard routes
router.use('/analytics', analyticsRoutes);

// Sales Transactions routes
router.use('/sales', salesTransactionRoutes);

// Export the router
export { router as apiRoutes };
