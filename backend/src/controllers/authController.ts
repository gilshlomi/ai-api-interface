import { Request, Response } from 'express';
import * as authService from '../services/authService';
import logger from '../utils/logger';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role = 'user' } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }
    
    // Register user
    const user = await authService.registerUser({
      username,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user'
    });
    
    res.status(201).json({ user });
  } catch (error: any) {
    logger.error(`Error registering user: ${error.message}`);
    
    if (error.message.includes('already exists')) {
      return res.status(409).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Login user
    const { token, user } = await authService.loginUser(email, password);
    
    res.status(200).json({ token, user });
  } catch (error: any) {
    logger.error(`Error logging in user: ${error.message}`);
    
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Get current user
export const getCurrentUser = (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = authService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error: any) {
    logger.error(`Error getting current user: ${error.message}`);
    res.status(500).json({ error: 'Failed to get user information' });
  }
};
