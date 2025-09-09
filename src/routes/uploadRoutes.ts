import express, { Router } from 'express';
import { upload } from '@/middleware/upload.js';
import { UploadController } from '@/controllers/UploadController.js';

const router: Router = express.Router();

// POST /uploads - Single file upload (form field: file)
router.post('/', upload.single('file'), UploadController.uploadSingle);

export default router;
