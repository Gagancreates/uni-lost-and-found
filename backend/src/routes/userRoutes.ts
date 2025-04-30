import express from 'express';
import { register, login, getProfile } from '../controllers/userController';
import auth from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register as express.RequestHandler);
router.post('/login', login as express.RequestHandler);

// Protected routes
router.get('/profile', auth as express.RequestHandler, getProfile as express.RequestHandler);

export default router; 