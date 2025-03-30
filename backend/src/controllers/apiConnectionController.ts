import { Request, Response } from 'express';
import * as apiConnectionService from '../services/apiConnectionService';
import logger from '../utils/logger';

// Get all API connections for the authenticated user
export const getAllConnections = (req: Request, res: Response) => {
  try {
    // In a real application, userId would come from the authenticated user
    // For now, we'll use a placeholder
    const userId = req.headers['x-user-id'] as string || 'user-1';
    
    const connections = apiConnectionService.getApiConnections(userId);
    
    // Remove sensitive data before sending to client
    const sanitizedConnections = connections.map(conn => {
      const { apiKey, username, password, ...rest } = conn;
      return {
        ...rest,
        hasApiKey: !!apiKey,
        hasCredentials: !!(username && password)
      };
    });
    
    res.status(200).json({ connections: sanitizedConnections });
  } catch (error: any) {
    logger.error(`Error getting API connections: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve API connections' });
  }
};

// Get a single API connection by ID
export const getConnectionById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'user-1';
    
    const connection = apiConnectionService.getApiConnectionById(id, userId);
    
    if (!connection) {
      return res.status(404).json({ error: 'API connection not found' });
    }
    
    // Remove sensitive data before sending to client
    const { apiKey, username, password, ...sanitizedConnection } = connection;
    
    res.status(200).json({
      connection: {
        ...sanitizedConnection,
        hasApiKey: !!apiKey,
        hasCredentials: !!(username && password)
      }
    });
  } catch (error: any) {
    logger.error(`Error getting API connection: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve API connection' });
  }
};

// Create a new API connection
export const createConnection = (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'user-1';
    const connectionData = req.body;
    
    // Validate required fields
    if (!connectionData.name || !connectionData.endpoint || !connectionData.authType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create the connection
    const newConnection = apiConnectionService.createApiConnection({
      ...connectionData,
      userId
    });
    
    // Remove sensitive data before sending to client
    const { apiKey, username, password, ...sanitizedConnection } = newConnection;
    
    res.status(201).json({
      connection: {
        ...sanitizedConnection,
        hasApiKey: !!apiKey,
        hasCredentials: !!(username && password)
      }
    });
  } catch (error: any) {
    logger.error(`Error creating API connection: ${error.message}`);
    res.status(500).json({ error: 'Failed to create API connection' });
  }
};

// Update an existing API connection
export const updateConnection = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'user-1';
    const updates = req.body;
    
    const updatedConnection = apiConnectionService.updateApiConnection(id, userId, updates);
    
    if (!updatedConnection) {
      return res.status(404).json({ error: 'API connection not found' });
    }
    
    // Remove sensitive data before sending to client
    const { apiKey, username, password, ...sanitizedConnection } = updatedConnection;
    
    res.status(200).json({
      connection: {
        ...sanitizedConnection,
        hasApiKey: !!apiKey,
        hasCredentials: !!(username && password)
      }
    });
  } catch (error: any) {
    logger.error(`Error updating API connection: ${error.message}`);
    res.status(500).json({ error: 'Failed to update API connection' });
  }
};

// Delete an API connection
export const deleteConnection = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'user-1';
    
    const success = apiConnectionService.deleteApiConnection(id, userId);
    
    if (!success) {
      return res.status(404).json({ error: 'API connection not found' });
    }
    
    res.status(200).json({ message: 'API connection deleted successfully' });
  } catch (error: any) {
    logger.error(`Error deleting API connection: ${error.message}`);
    res.status(500).json({ error: 'Failed to delete API connection' });
  }
};

// Add sample connections (for testing)
export const addSampleConnections = (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'user-1';
    
    apiConnectionService.addSampleConnections(userId);
    
    res.status(200).json({ message: 'Sample connections added successfully' });
  } catch (error: any) {
    logger.error(`Error adding sample connections: ${error.message}`);
    res.status(500).json({ error: 'Failed to add sample connections' });
  }
};
