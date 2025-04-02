import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import ApiRequestPanel from '../../components/api/ApiRequestPanel';
import ApiUsageMetrics from '../../components/api/ApiUsageMetrics';
import ApiLogsViewer from '../../components/api/ApiLogsViewer';
import styles from './ApiInteractionManager.module.css';

interface ApiInteractionManagerProps {
  connectionId: string;
}

import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import ApiRequestPanel from '../../components/api/ApiRequestPanel';
import ApiUsageMetrics from '../../components/api/ApiUsageMetrics';
import ApiLogsViewer from '../../components/api/ApiLogsViewer';
import styles from './ApiInteractionManager.module.css';

interface ApiInteractionManagerProps {
  connectionId: string;
}

const ApiInteractionManager: React.FC<ApiInteractionManagerProps> = ({ connectionId }) => {
  const { token, isAuthenticated } = useAuth();
  const [connection, setConnection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'request' | 'metrics' | 'logs'>('request');

  // ... rest of the component code ...

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{connection.name}</h1>
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'request' ? styles.tabActive : styles.tabInactive}`}
            onClick={() => setActiveTab('request')}
          >
            Request
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'metrics' ? styles.tabActive : styles.tabInactive}`}
            onClick={() => setActiveTab('metrics')}
          >
            Metrics
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'logs' ? styles.tabActive : styles.tabInactive}`}
            onClick={() => setActiveTab('logs')}
          >
            Logs
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
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
  const { token, isAuthenticated } = useAuth();
  const [connection, setConnection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'request' | 'metrics' | 'logs'>('request');

  // ... rest of the component code ...

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{connection.name}</h1>
        <div className={styles.tabContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'request' ? styles.tabActive : styles.tabInactive}`}
            onClick={() => setActiveTab('request')}
          >
            Request
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'metrics' ? styles.tabActive : styles.tabInactive}`}
            onClick={() => setActiveTab('metrics')}
          >
            Metrics
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'logs' ? styles.tabActive : styles.tabInactive}`}
            onClick={() => setActiveTab('logs')}
          >
            Logs
          </button>
        </div>
      </div>
      
      <div className={styles.content}>
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