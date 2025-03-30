import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Interface for API connection configuration
export interface ApiConnection {
  id: string;
  name: string;
  endpoint: string;
  authType: 'apiKey' | 'basic' | 'oauth' | 'none';
  apiKey?: string;
  username?: string;
  password?: string;
  headers?: Record<string, string>;
  rateLimit?: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// In-memory storage for API connections (will be replaced with database in production)
const apiConnections: ApiConnection[] = [];

// Get all API connections for a user
export const getApiConnections = (userId: string): ApiConnection[] => {
  return apiConnections.filter(conn => conn.userId === userId);
};

// Get a single API connection by ID
export const getApiConnectionById = (id: string, userId: string): ApiConnection | undefined => {
  return apiConnections.find(conn => conn.id === id && conn.userId === userId);
};

// Create a new API connection
export const createApiConnection = (connection: Omit<ApiConnection, 'id' | 'createdAt' | 'updatedAt'>): ApiConnection => {
  const newConnection: ApiConnection = {
    ...connection,
    id: `conn_${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  apiConnections.push(newConnection);
  logger.info(`Created new API connection: ${newConnection.name}`, { connectionId: newConnection.id });
  
  return newConnection;
};

// Update an existing API connection
export const updateApiConnection = (
  id: string, 
  userId: string, 
  updates: Partial<Omit<ApiConnection, 'id' | 'createdAt' | 'updatedAt' | 'userId'>>
): ApiConnection | null => {
  const index = apiConnections.findIndex(conn => conn.id === id && conn.userId === userId);
  
  if (index === -1) {
    return null;
  }
  
  const updatedConnection = {
    ...apiConnections[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  apiConnections[index] = updatedConnection;
  logger.info(`Updated API connection: ${updatedConnection.name}`, { connectionId: updatedConnection.id });
  
  return updatedConnection;
};

// Delete an API connection
export const deleteApiConnection = (id: string, userId: string): boolean => {
  const index = apiConnections.findIndex(conn => conn.id === id && conn.userId === userId);
  
  if (index === -1) {
    return false;
  }
  
  const deletedConnection = apiConnections[index];
  apiConnections.splice(index, 1);
  logger.info(`Deleted API connection: ${deletedConnection.name}`, { connectionId: deletedConnection.id });
  
  return true;
};

// Add some sample API connections for testing
export const addSampleConnections = (userId: string): void => {
  const sampleConnections: Omit<ApiConnection, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      name: 'OpenAI API',
      endpoint: 'https://api.openai.com/v1',
      authType: 'apiKey',
      apiKey: 'sample-api-key-1',
      rateLimit: 60,
      userId
    },
    {
      name: 'Azure OpenAI Service',
      endpoint: 'https://your-resource.openai.azure.com',
      authType: 'apiKey',
      apiKey: 'sample-api-key-2',
      rateLimit: 100,
      userId
    },
    {
      name: 'Google AI API',
      endpoint: 'https://generativelanguage.googleapis.com/v1',
      authType: 'apiKey',
      apiKey: 'sample-api-key-3',
      rateLimit: 120,
      userId
    }
  ];
  
  sampleConnections.forEach(conn => createApiConnection(conn));
};
