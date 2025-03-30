import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config';
import logger from '../utils/logger';

// Interface for User
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for users (will be replaced with database in production)
const users: User[] = [];

// Add a sample admin user
const createSampleUsers = () => {
  if (users.length === 0) {
    const adminPassword = bcrypt.hashSync('admin123', 10);
    const userPassword = bcrypt.hashSync('user123', 10);
    
    users.push({
      id: 'user-1',
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    users.push({
      id: 'user-2',
      username: 'user',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    logger.info('Sample users created');
  }
};

// Create sample users on startup
createSampleUsers();

// Register a new user
export const registerUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<Omit<User, 'password'>> => {
  // Check if user already exists
  const existingUser = users.find(u => u.email === userData.email || u.username === userData.username);
  if (existingUser) {
    throw new Error('User with this email or username already exists');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Create new user
  const newUser: User = {
    id: `user-${Date.now()}`,
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  users.push(newUser);
  logger.info(`User registered: ${newUser.username}`, { userId: newUser.id });
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

// Login user
export const loginUser = async (email: string, password: string): Promise<{ token: string, user: Omit<User, 'password'> }> => {
  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
  
  logger.info(`User logged in: ${user.username}`, { userId: user.id });
  
  // Return token and user without password
  const { password: _, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};

// Get user by ID
export const getUserById = (userId: string): Omit<User, 'password'> | null => {
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return null;
  }
  
  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as { userId: string, role: string };
    
    // Add user ID to request
    req.headers['x-user-id'] = decoded.userId;
    req.headers['x-user-role'] = decoded.role;
    
    next();
  } catch (error) {
    logger.error('Authentication error', { error });
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Role-based authorization middleware
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.headers['x-user-role'] as string;
    
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
