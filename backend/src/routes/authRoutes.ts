import express from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../services/authService';

const router = express.Router();

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user (protected route)
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
