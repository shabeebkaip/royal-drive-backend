import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { query } from 'express-validator';
import { validationResult } from 'express-validator';

const router: Router = Router();

// Validation middleware inline
const validateAnalyticsQuery = [
  query('period').optional().isIn(['last_7_days','last_30_days','last_90_days','ytd','all_time','custom']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    // If custom period ensure dateFrom/dateTo present
    if (req.query.period === 'custom' && (!req.query.dateFrom || !req.query.dateTo)) {
      return res.status(400).json({ success: false, message: 'dateFrom and dateTo required for custom period' });
    }
    next();
  }
];

// Require at least manager level for analytics (includes superAdmin, admin, manager)
router.use(authenticate, requireRole('superAdmin','admin','manager'));

router.get('/dashboard', validateAnalyticsQuery, AnalyticsController.getDashboard);

export default router;
