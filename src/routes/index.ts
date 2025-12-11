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
import { authRoutes } from './authRoutes.js';
import vehicleEnquiryRoutes from './vehicleEnquiryRoutes.js';
import carSubmissionRoutes from './carSubmissionRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import salesTransactionRoutes from './salesTransactionRoutes.js';
import contactEnquiryRoutes from './contactEnquiryRoutes.js';
import settingsRoutes from './settingsRoutes.js';

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

// Contact Enquiry routes
router.use('/contact-enquiries', contactEnquiryRoutes);

// Settings routes
router.use('/settings', settingsRoutes);

// Export the router
export { router as apiRoutes };
