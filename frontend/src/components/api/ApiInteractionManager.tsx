import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import ApiRequestPanel from '../../components/api/ApiRequestPanel';
import ApiUsageMetrics from '../../components/api/ApiUsageMetrics';
import ApiLogsViewer from '../../components/api/ApiLogsViewer';

interface ApiInteractionManagerProps {
  connectionId: string;
}

const ApiInteractionManager: React.FC<ApiInteractionManagerProps> = ({ connectionId }) => {
  const { token, isAuthenticated } = useAuth();
  const [connection, setConnection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'request' | 'metrics' | 'logs'>('request');

  // Fetch API connection details on component mount
  useEffect(() => {
    if (isAuthenticated && token && connectionId) {
      fetchConnectionDetails();
    }
  }, [isAuthenticated, token, connectionId]);

  // Fetch API connection details from backend
  const fetchConnectionDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/connections/${connectionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch API connection details');
      }

      const data = await response.json();
      setConnection(data.connection);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching connection details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading API connection details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">API connection not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--intel-blue-primary)]">
          {connection.name}
        </h1>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'request' ? 'bg-white border-t border-l border-r border-gray-200 font-medium text-[var(--intel-blue-primary)]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('request')}
          >
            Request
          </button>
          <button 
            className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'metrics' ? 'bg-white border-t border-l border-r border-gray-200 font-medium text-[var(--intel-blue-primary)]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('metrics')}
          >
            Metrics
          </button>
          <button 
            className={`px-4 py-2 rounded-t-lg transition-colors ${activeTab === 'logs' ? 'bg-white border-t border-l border-r border-gray-200 font-medium text-[var(--intel-blue-primary)]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveTab('logs')}
          >
            Logs
          </button>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeTab === 'request' && (
          <ApiRequestPanel 
            connectionId={connection.id} 
            connectionName={connection.name} 
          />
        )}
        
        {activeTab === 'metrics' && (
          <ApiUsageMetrics 
            connectionId={connection.id} 
            connectionName={connection.name} 
          />
        )}
        
        {activeTab === 'logs' && (
          <ApiLogsViewer 
            connectionId={connection.id} 
            connectionName={connection.name} 
          />
        )}
      </div>
    </div>
  );
};

export default ApiInteractionManager;
