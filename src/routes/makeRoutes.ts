import express, { Router } from 'express';
import { MakeController } from '../controllers/MakeController.js';
import { validateMake, validateMakeUpdate } from '../middleware/makeValidation.js';

const router: Router = express.Router();

// GET /makes - Get all makes with filtering and pagination
router.get('/', MakeController.getAllMakes);

// GET /makes/search - Search makes
router.get('/search', MakeController.searchMakes);

// GET /makes/active - Get active makes
router.get('/active', MakeController.getActiveMakes);

// GET /makes/popular - Get popular makes
router.get('/popular', MakeController.getPopularMakes);

// GET /makes/stats - Get make statistics
router.get('/stats', MakeController.getMakeStats);

// GET /makes/slug/:slug - Get make by slug
router.get('/slug/:slug', MakeController.getMakeBySlug);

// GET /makes/:id - Get make by ID
router.get('/:id', MakeController.getMake);

// POST /makes - Create new make
router.post('/', validateMake, MakeController.createMake);

// PUT /makes/:id - Update make
router.put('/:id', validateMakeUpdate, MakeController.updateMake);

// PATCH /makes/:id/status - Update make status
router.patch('/:id/status', MakeController.updateMakeStatus);

// DELETE /makes/:id - Delete make
router.delete('/:id', MakeController.deleteMake);

export { router as makeRoutes };
