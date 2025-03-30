import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import logger from '../utils/logger';
import { ApiConnection } from './apiConnectionService';

// Interface for API request
export interface ApiRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

// Interface for API response
export interface ApiResponse {
  status: number;
  data: any;
  headers: Record<string, string>;
  duration: number;
}

// Interface for API request log
export interface ApiRequestLog {
  id: string;
  connectionId: string;
  userId: string;
  endpoint: string;
  method: string;
  status: number;
  duration: number;
  timestamp: Date;
  error?: string;
}

// In-memory storage for API request logs (will be replaced with database in production)
const apiRequestLogs: ApiRequestLog[] = [];

// Proxy API request to the target service
export const proxyApiRequest = async (
  connection: ApiConnection,
  request: ApiRequest,
  userId: string
): Promise<ApiResponse> => {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}`;
  
  try {
    logger.info(`Proxying API request to ${connection.name}`, {
      connectionId: connection.id,
      endpoint: request.endpoint,
      method: request.method,
      requestId
    });
    
    // Prepare request configuration
    const config: AxiosRequestConfig = {
      method: request.method,
      url: `${connection.endpoint}/${request.endpoint}`.replace(/\/+/g, '/').replace(':/', '://'),
      data: request.data,
      params: request.params,
      headers: {
        ...request.headers
      }
    };
    
    // Add authentication based on connection type
    if (connection.authType === 'apiKey' && connection.apiKey) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${connection.apiKey}`
      };
    } else if (connection.authType === 'basic' && connection.username && connection.password) {
      const auth = Buffer.from(`${connection.username}:${connection.password}`).toString('base64');
      config.headers = {
        ...config.headers,
        'Authorization': `Basic ${auth}`
      };
    }
    
    // Add custom headers from connection if available
    if (connection.headers) {
      config.headers = {
        ...config.headers,
        ...connection.headers
      };
    }
    
    // Make the request
    const response: AxiosResponse = await axios(config);
    const duration = Date.now() - startTime;
    
    // Log successful request
    const logEntry: ApiRequestLog = {
      id: requestId,
      connectionId: connection.id,
      userId,
      endpoint: request.endpoint,
      method: request.method,
      status: response.status,
      duration,
      timestamp: new Date()
    };
    
    apiRequestLogs.push(logEntry);
    
    logger.info(`API request completed successfully in ${duration}ms`, {
      connectionId: connection.id,
      endpoint: request.endpoint,
      status: response.status,
      duration,
      requestId
    });
    
    // Return formatted response
    return {
      status: response.status,
      data: response.data,
      headers: response.headers as Record<string, string>,
      duration
    };
  } catch (error: any) {
    const duration = Date.now() - startTime;
    const status = error.response?.status || 500;
    
    // Log error
    const logEntry: ApiRequestLog = {
      id: requestId,
      connectionId: connection.id,
      userId,
      endpoint: request.endpoint,
      method: request.method,
      status,
      duration,
      timestamp: new Date(),
      error: error.message
    };
    
    apiRequestLogs.push(logEntry);
    
    logger.error(`API request failed in ${duration}ms: ${error.message}`, {
      connectionId: connection.id,
      endpoint: request.endpoint,
      status,
      duration,
      error: error.message,
      requestId
    });
    
    // Return error response
    return {
      status,
      data: error.response?.data || { error: error.message },
      headers: error.response?.headers as Record<string, string> || {},
      duration
    };
  }
};

// Get API request logs for a user
export const getApiRequestLogs = (
  userId: string,
  connectionId?: string,
  limit: number = 100
): ApiRequestLog[] => {
  let logs = apiRequestLogs.filter(log => log.userId === userId);
  
  if (connectionId) {
    logs = logs.filter(log => log.connectionId === connectionId);
  }
  
  // Sort by timestamp (newest first) and limit results
  return logs
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};
