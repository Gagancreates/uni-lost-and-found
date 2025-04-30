import express from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController';
import auth from '../middleware/auth';
import upload from '../utils/multerConfig';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Public routes
router.get('/', getPosts as express.RequestHandler);
router.get('/:id', getPostById as express.RequestHandler);

// Protected routes with single image upload
router.post('/', auth as express.RequestHandler, upload.single('image'), createPost as express.RequestHandler);
router.put('/:id', auth as express.RequestHandler, upload.single('image'), updatePost as express.RequestHandler);
router.delete('/:id', auth as express.RequestHandler, deletePost as express.RequestHandler);

export default router; 