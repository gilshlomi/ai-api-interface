import React, { useState } from 'react';

interface ApiUsageMetricsProps {
  connectionId: string;
  connectionName: string;
}

const ApiUsageMetrics: React.FC<ApiUsageMetricsProps> = ({
  connectionId,
  connectionName
}) => {
  // Mock data for demonstration
  const [timeRange, setTimeRange] = useState('day');
  const [usageData, setUsageData] = useState({
    totalRequests: 1247,
    successRate: 98.5,
    averageLatency: 245, // ms
    costToDate: 12.85,
    requestsByEndpoint: {
      'chat/completions': 876,
      'images/generations': 214,
      'embeddings': 157
    },
    requestsOverTime: [
      { hour: '00:00', requests: 12 },
      { hour: '02:00', requests: 5 },
      { hour: '04:00', requests: 3 },
      { hour: '06:00', requests: 8 },
      { hour: '08:00', requests: 42 },
      { hour: '10:00', requests: 87 },
      { hour: '12:00', requests: 124 },
      { hour: '14:00', requests: 156 },
      { hour: '16:00', requests: 143 },
      { hour: '18:00', requests: 98 },
      { hour: '20:00', requests: 67 },
      { hour: '22:00', requests: 31 }
    ]
  });

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
    // In a real application, this would fetch new data based on the time range
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--intel-blue-primary)]">
          Usage Metrics - {connectionName}
        </h2>
        <select 
          value={timeRange} 
          onChange={handleTimeRangeChange}
          className="input-field w-40"
        >
          <option value="day">Last 24 Hours</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-[var(--intel-blue-primary)]">{usageData.totalRequests}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-[var(--intel-blue-primary)]">{usageData.successRate}%</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Avg. Latency</p>
          <p className="text-2xl font-bold text-[var(--intel-blue-primary)]">{usageData.averageLatency} ms</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Cost to Date</p>
          <p className="text-2xl font-bold text-[var(--intel-blue-primary)]">${usageData.costToDate}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Requests by Endpoint</h3>
          <div className="space-y-3">
            {Object.entries(usageData.requestsByEndpoint).map(([endpoint, count]) => (
              <div key={endpoint} className="flex items-center">
                <div className="w-32 truncate text-sm">{endpoint}</div>
                <div className="flex-grow mx-2">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--intel-blue-primary)]" 
                      style={{ width: `${(count / usageData.totalRequests) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm font-medium">{count}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Requests Over Time</h3>
          <div className="h-48 flex items-end space-x-1">
            {usageData.requestsOverTime.map((data) => {
              const maxRequests = Math.max(...usageData.requestsOverTime.map(d => d.requests));
              const height = (data.requests / maxRequests) * 100;
              
              return (
                <div key={data.hour} className="flex flex-col items-center flex-grow">
                  <div 
                    className="w-full bg-[var(--intel-blue-primary)] rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs mt-1 transform -rotate-45 origin-top-left">{data.hour}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiUsageMetrics;
