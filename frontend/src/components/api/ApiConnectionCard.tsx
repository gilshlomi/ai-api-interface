import React, { useState } from 'react';

interface ApiConnectionCardProps {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'configuring';
  lastUsed?: string;
  onEdit: (id: string) => void;
  onTest: (id: string) => void;
  onDelete: (id: string) => void;
}

const ApiConnectionCard: React.FC<ApiConnectionCardProps> = ({
  id,
  name,
  status,
  lastUsed,
  onEdit,
  onTest,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'disconnected':
        return 'text-gray-600';
      case 'error':
        return 'text-red-600';
      case 'configuring':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'disconnected':
        return 'Disconnected';
      case 'error':
        return 'Connection Error';
      case 'configuring':
        return 'Configuration Required';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="card mb-4 transition-all duration-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-2">
            {name}
          </h3>
          <p className="text-gray-700 mb-2">
            Status: <span className={`font-medium ${getStatusColor()}`}>{getStatusText()}</span>
          </p>
          {lastUsed && (
            <p className="text-sm text-gray-600">
              Last used: {lastUsed}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button 
            className="btn-secondary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Hide Details' : 'Show Details'}
          </button>
          <button 
            className="btn-secondary"
            onClick={() => onEdit(id)}
          >
            Edit
          </button>
          <button 
            className="btn-secondary"
            onClick={() => onTest(id)}
            disabled={status !== 'connected'}
          >
            Test
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700">API Endpoint</p>
              <p className="text-sm text-gray-600">https://api.example.com/v1</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Authentication Type</p>
              <p className="text-sm text-gray-600">API Key</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Rate Limit</p>
              <p className="text-sm text-gray-600">100 requests/minute</p>
            </div>
            <div className="pt-2">
              <button 
                className="text-red-600 hover:text-red-800 text-sm font-medium"
                onClick={() => onDelete(id)}
              >
                Delete Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiConnectionCard;
