import { Router } from 'express';
import { SalesTransactionController } from '../controllers/SalesTransactionController.js';
import { createSalesValidation, updateSalesValidation } from '../middleware/salesTransactionValidation.js';
import { authenticate } from '../middleware/auth.js';

const router: Router = Router();

// Protected routes (assuming sales operations require auth)
router.use(authenticate);

router.get('/', SalesTransactionController.list);
router.get('/summary', SalesTransactionController.summary);
router.get('/:id', SalesTransactionController.get);
router.post('/', createSalesValidation, SalesTransactionController.create);
router.patch('/:id', updateSalesValidation, SalesTransactionController.update);
router.post('/:id/complete', SalesTransactionController.complete);
router.post('/:id/cancel', SalesTransactionController.cancel);
router.delete('/:id', SalesTransactionController.remove);

export default router;
