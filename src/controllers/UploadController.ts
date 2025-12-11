import { Request, Response } from 'express';
import { uploadService } from '../services/UploadService.js';
import { createApiResponse } from '@/utils/index';

export class UploadController {
  static async uploadSingle(req: Request, res: Response): Promise<void> {
    try {
      const file = (req as any).file as Express.Multer.File | undefined;
      if (!file) {
        const response = createApiResponse(false, 'No file provided. Use form field "file".');
        res.status(400).json(response);
        return;
      }

      const folder = (req.body?.folder as string | undefined) || undefined;
      const result = await uploadService.uploadBuffer(file, folder);

      const response = createApiResponse(true, 'File uploaded', result);
      res.status(201).json(response);
    } catch (error) {
      const response = createApiResponse(
        false,
        'Upload failed',
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );
      res.status(400).json(response);
    }
  }
}
