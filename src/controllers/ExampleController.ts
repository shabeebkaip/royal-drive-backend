import { Request, Response } from 'express';
import { createApiResponse } from '../utils/index.js';

// Example controller for demonstration purposes
export class ExampleController {
  static async getHealth(req: Request, res: Response): Promise<void> {
    try {
      const response = createApiResponse(
        true,
        'Example controller is working',
        {
          status: 'healthy',
          timestamp: new Date().toISOString()
        }
      );
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Internal server error',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }

  static async getInfo(req: Request, res: Response): Promise<void> {
    try {
      const response = createApiResponse(
        true,
        'Royal Drive Backend - Clean Starter Pack',
        {
          version: '1.0.0',
          description: 'Clean TypeScript Node.js backend starter pack',
          features: [
            'TypeScript',
            'Express.js',
            'MongoDB with Mongoose',
            'JWT utilities',
            'Error handling',
            'Rate limiting',
            'CORS',
            'Helmet security',
            'Morgan logging',
            'Environment configuration'
          ]
        }
      );
      res.status(200).json(response);
    } catch (error) {
      const errorResponse = createApiResponse(
        false,
        'Internal server error',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(500).json(errorResponse);
    }
  }
}
