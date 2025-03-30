import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import logger from './utils/logger';
import fs from 'fs';
import path from 'path';

// Import routes
import apiConnectionRoutes from './routes/apiConnectionRoutes';
import apiProxyRoutes from './routes/apiProxyRoutes';
import authRoutes from './routes/authRoutes';

// Initialize express app
const app = express();

// Create logs directory if it doesn't exist
const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logDir, 'access.log'),
  { flags: 'a' }
);

// Middleware
app.use(helmet()); // Security headers
app.use(cors(config.cors)); // CORS configuration
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('combined', { stream: accessLogStream })); // HTTP request logging

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/connections', apiConnectionRoutes);
app.use('/api/proxy', apiProxyRoutes);
app.use('/auth', authRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { error: err, path: req.path });
  res.status(500).json({
    error: {
      message: 'Internal Server Error',
      ...(config.server.nodeEnv === 'development' && { details: err.message }),
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn(`Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: {
      message: 'Route not found',
    },
  });
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.server.nodeEnv} mode`);
});

export default app;
