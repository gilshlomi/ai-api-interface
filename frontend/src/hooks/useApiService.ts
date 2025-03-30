import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';

interface ApiServiceHookProps {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
  connectionId: string;
  immediate?: boolean;
}

interface ApiServiceHookResult {
  data: any;
  error: string | null;
  isLoading: boolean;
  execute: () => Promise<void>;
}

export const useApiService = ({
  endpoint,
  method = 'GET',
  body,
  params,
  headers,
  connectionId,
  immediate = false
}: ApiServiceHookProps): ApiServiceHookResult => {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/proxy/${connectionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          endpoint,
          method,
          data: body,
          params,
          headers
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const responseData = await response.json();
      setData(responseData);
      return responseData;
    } catch (err: any) {
      setError(err.message);
      console.error('API request error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (immediate && token) {
      execute();
    }
  }, [token, immediate]);

  return { data, error, isLoading, execute };
};

export const useApiConnections = () => {
  const { token } = useAuth();
  const [connections, setConnections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/connections', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch API connections');
      }

      const data = await response.json();
      setConnections(data.connections || []);
      return data.connections;
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching connections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addConnection = async (connectionData: any) => {
    try {
      setError(null);
      
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(connectionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add API connection');
      }

      const data = await response.json();
      await fetchConnections();
      return data.connection;
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding connection:', err);
      throw err;
    }
  };

  const updateConnection = async (id: string, connectionData: any) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/connections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(connectionData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update API connection');
      }

      const data = await response.json();
      await fetchConnections();
      return data.connection;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating connection:', err);
      throw err;
    }
  };

  const deleteConnection = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/connections/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete API connection');
      }

      await fetchConnections();
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting connection:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (token) {
      fetchConnections();
    }
  }, [token]);

  return {
    connections,
    isLoading,
    error,
    fetchConnections,
    addConnection,
    updateConnection,
    deleteConnection
  };
};
