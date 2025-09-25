import express, { Router } from 'express';
import { ModelController } from '../controllers/ModelController';
import { validateModel, validateModelUpdate } from '../middleware/modelValidation';

const router: Router = express.Router();

// GET /models - Get all models with filtering and pagination
router.get('/', ModelController.getAllModels);

// GET /models/search - Search models
router.get('/search', ModelController.searchModels);

// GET /models/active - Get active models
router.get('/active', ModelController.getActiveModels);

// GET /models/popular - Get popular models
router.get('/popular', ModelController.getPopularModels);

// GET /models/stats - Get model statistics
router.get('/stats', ModelController.getModelStats);

// GET /models/dropdown - Get active models for dropdown
router.get('/dropdown', ModelController.getModelsDropdown);

// GET /models/make/:makeId - Get models by make
router.get('/make/:makeId', ModelController.getModelsByMake);

// GET /models/vehicle-type/:vehicleTypeId - Get models by vehicle type
router.get('/vehicle-type/:vehicleTypeId', ModelController.getModelsByVehicleType);

// GET /models/slug/:slug - Get model by slug
router.get('/slug/:slug', ModelController.getModelBySlug);

// GET /models/:id - Get model by ID
router.get('/:id', ModelController.getModel);

// POST /models - Create new model
router.post('/', validateModel, ModelController.createModel);

// PUT /models/:id - Update model
router.put('/:id', validateModelUpdate, ModelController.updateModel);

// PATCH /models/:id/status - Update model status
router.patch('/:id/status', ModelController.updateModelStatus);

// DELETE /models/:id - Delete model
router.delete('/:id', ModelController.deleteModel);

export { router as modelRoutes };
