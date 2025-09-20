import { Router, Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { TransmissionController } from '../controllers/TransmissionController';
import { transmissionValidation } from '../middleware/transmissionValidation';

const router: Router = Router();

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

// GET /transmissions/dropdown - Get active transmissions for dropdown (must be before /:id)
router.get('/dropdown', TransmissionController.getActiveTransmissions);

// GET /transmissions/search - Search transmissions (must be before /:id)
router.get('/search', 
  transmissionValidation.search,
  handleValidationErrors,
  TransmissionController.searchTransmissions
);

// GET /transmissions/popular - Get popular transmissions (must be before /:id)
router.get('/popular', TransmissionController.getPopularTransmissions);

// GET /transmissions/stats - Get transmission statistics (must be before /:id)
router.get('/stats', TransmissionController.getTransmissionStats);

// GET /transmissions - Get all transmissions with filtering and pagination
router.get('/', 
  transmissionValidation.list,
  handleValidationErrors,
  TransmissionController.getAllTransmissions
);

// GET /transmissions/slug/:slug - Get transmission by slug
router.get('/slug/:slug',
  transmissionValidation.getBySlug,
  handleValidationErrors,
  TransmissionController.getTransmissionBySlug
);

// GET /transmissions/:id - Get transmission by ID
router.get('/:id',
  transmissionValidation.getById,
  handleValidationErrors,
  TransmissionController.getTransmissionById
);

// POST /transmissions - Create new transmission
router.post('/',
  transmissionValidation.create,
  handleValidationErrors,
  TransmissionController.createTransmission
);

// PUT /transmissions/:id - Update transmission
router.put('/:id',
  transmissionValidation.update,
  handleValidationErrors,
  TransmissionController.updateTransmission
);

// PATCH /transmissions/:id/status - Update transmission status
router.patch('/:id/status',
  transmissionValidation.updateStatus,
  handleValidationErrors,
  TransmissionController.updateTransmissionStatus
);

// DELETE /transmissions/:id - Delete transmission
router.delete('/:id',
  transmissionValidation.getById,
  handleValidationErrors,
  TransmissionController.deleteTransmission
);

export default router;
