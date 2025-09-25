import express, { Router } from 'express';
import { upload } from '@/middleware/upload';
import { UploadController } from '@/controllers/UploadController';

const router: Router = express.Router();

// POST /uploads - Single file upload (form field: file)
router.post('/', upload.single('file'), UploadController.uploadSingle);

export default router;
