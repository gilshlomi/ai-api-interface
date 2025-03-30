import { Request, Response } from 'express';
import * as apiProxyService from '../services/apiProxyService';
import * as apiConnectionService from '../services/apiConnectionService';
import logger from '../utils/logger';

// Proxy an API request to the target service
export const proxyRequest = async (req: Request, res: Response) => {
  try {
    const { connectionId } = req.params;
    const userId = req.headers['x-user-id'] as string || 'user-1';
    
    // Get the connection
    const connection = apiConnectionService.getApiConnectionById(connectionId, userId);
    
    if (!connection) {
      return res.status(404).json({ error: 'API connection not found' });
    }
    
    // Extract request details from the body
    const { endpoint, method, data, params, headers } = req.body;
    
    if (!endpoint || !method) {
      return res.status(400).json({ error: 'Missing required fields: endpoint and method are required' });
    }
    
    // Validate method
    const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    if (!validMethods.includes(method)) {
      return res.status(400).json({ error: `Invalid method: ${method}. Must be one of ${validMethods.join(', ')}` });
    }
    
    // Proxy the request
    const response = await apiProxyService.proxyApiRequest(
      connection,
      {
        endpoint,
        method: method as any,
        data,
        params,
        headers
      },
      userId
    );
    
    // Return the response
    res.status(200).json({
      status: response.status,
      data: response.data,
      duration: response.duration
    });
  } catch (error: any) {
    logger.error(`Error proxying API request: ${error.message}`);
    res.status(500).json({ error: 'Failed to proxy API request' });
  }
};

// Get API request logs
export const getLogs = (req: Request, res: Response) => {
  try {
    const userId = req.headers['x-user-id'] as string || 'user-1';
    const { connectionId } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
    
    const logs = apiProxyService.getApiRequestLogs(
      userId,
      connectionId as string | undefined,
      limit
    );
    
    res.status(200).json({ logs });
  } catch (error: any) {
    logger.error(`Error getting API logs: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve API logs' });
  }
};
