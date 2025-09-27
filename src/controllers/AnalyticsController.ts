import { Request, Response } from 'express';
import { AnalyticsService } from '../services/AnalyticsService';

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response): Promise<Response> {
    try {
      const { period, dateFrom, dateTo } = req.query as any;
      const data = await AnalyticsService.getDashboardOverview({ period, dateFrom, dateTo });
      return res.status(200).json({ success: true, message: 'Dashboard analytics', data });
    } catch (error: any) {
      console.error('Error fetching dashboard analytics:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch analytics', error: error.message });
    }
  }
}
