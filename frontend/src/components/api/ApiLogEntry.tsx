import React from 'react';

interface ApiLogEntryProps {
  id: string;
  timestamp: string;
  endpoint: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  duration: number;
}

const ApiLogEntry: React.FC<ApiLogEntryProps> = ({
  id,
  timestamp,
  endpoint,
  status,
  message,
  duration
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      default:
        return '•';
    }
  };

  return (
    <div className="border-b border-gray-200 py-3 hover:bg-gray-50">
      <div className="flex items-center">
        <div className={`mr-2 font-bold ${getStatusColor()}`}>
          {getStatusIcon()}
        </div>
        <div className="grid grid-cols-12 gap-2 w-full text-sm">
          <div className="col-span-2 text-gray-500">{timestamp}</div>
          <div className="col-span-3 truncate">{endpoint}</div>
          <div className="col-span-5 truncate">{message}</div>
          <div className="col-span-2 text-right text-gray-500">{duration}ms</div>
        </div>
      </div>
    </div>
  );
};

export default ApiLogEntry;
