import React, { useState } from 'react';
import ApiLogEntry from './ApiLogEntry';
import styles from './ApiLogsViewer.module.css';

export const ApiLogsViewer = () => {
  return (
    <div className={styles.container}>
      {/* Your log entries */}
      <div className={styles.logEntry}>
        <div className={styles.timestamp}>2024-04-01 15:01:06</div>
        <div className={styles.message}>Log message here</div>
      </div>
    </div>
  );
};
interface ApiLogsViewerProps {
  connectionId?: string;
  connectionName?: string;
}

const ApiLogsViewer: React.FC<ApiLogsViewerProps> = ({
  connectionId,
  connectionName
}) => {
  const [filter, setFilter] = useState('all');
  
  // Mock data for demonstration
  const logs = [
    {
      id: '1',
      timestamp: '2025-03-30 20:15:32',
      endpoint: 'chat/completions',
      status: 'success' as const,
      message: 'Request completed successfully',
      duration: 245
    },
    {
      id: '2',
      timestamp: '2025-03-30 20:12:18',
      endpoint: 'images/generations',
      status: 'success' as const,
      message: 'Image generated successfully',
      duration: 1245
    },
    {
      id: '3',
      timestamp: '2025-03-30 20:10:05',
      endpoint: 'chat/completions',
      status: 'error' as const,
      message: 'Rate limit exceeded',
      duration: 87
    },
    {
      id: '4',
      timestamp: '2025-03-30 20:05:47',
      endpoint: 'embeddings',
      status: 'success' as const,
      message: 'Embeddings generated successfully',
      duration: 156
    },
    {
      id: '5',
      timestamp: '2025-03-30 20:01:22',
      endpoint: 'chat/completions',
      status: 'warning' as const,
      message: 'High latency detected',
      duration: 1876
    },
    {
      id: '6',
      timestamp: '2025-03-30 19:55:10',
      endpoint: 'images/generations',
      status: 'error' as const,
      message: 'Invalid prompt: content policy violation',
      duration: 134
    },
    {
      id: '7',
      timestamp: '2025-03-30 19:50:33',
      endpoint: 'chat/completions',
      status: 'success' as const,
      message: 'Request completed successfully',
      duration: 267
    }
  ];

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--intel-blue-primary)]">
          {connectionName ? `Logs - ${connectionName}` : 'API Logs'}
        </h2>
        <div className="flex space-x-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="input-field w-40"
          >
            <option value="all">All Logs</option>
            <option value="success">Success Only</option>
            <option value="error">Errors Only</option>
            <option value="warning">Warnings Only</option>
          </select>
          <button className="btn-secondary">
            Export Logs
          </button>
        </div>
      </div>
      
      <div className="bg-slate-50 border border-gray-200 rounded-md">
        <div className="grid grid-cols-12 gap-2 w-full text-sm font-medium bg-gray-100 p-3 border-b border-gray-200">
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-3">Endpoint</div>
          <div className="col-span-5">Message</div>
          <div className="col-span-2 text-right">Duration</div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <ApiLogEntry 
                key={log.id}
                id={log.id}
                timestamp={log.timestamp}
                endpoint={log.endpoint}
                status={log.status}
                message={log.message}
                duration={log.duration}
              />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No logs found matching the current filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiLogsViewer;
