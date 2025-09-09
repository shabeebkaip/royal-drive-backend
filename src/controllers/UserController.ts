import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { createApiResponse } from '@/utils/index.js';

export class HealthController {
  // Simple health check endpoint
  getHealth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const response = createApiResponse(true, 'Server is running perfectly!', {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    });
    res.json(response);
  });

  // Simple API info endpoint
  getInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const response = createApiResponse(true, 'Royal Drive Backend API', {
      name: 'Royal Drive Backend',
      version: '1.0.0',
      description: 'Modern Node.js backend starter pack',
      endpoints: [
        'GET /health - Health check',
        'GET /api/v1/info - API information',
      ],
    });
    res.json(response);
  });
}

// This file has been removed as part of clean starter pack
// User functionality is not included in the starter pack
// Use ExampleController.ts as a template for new controllers
