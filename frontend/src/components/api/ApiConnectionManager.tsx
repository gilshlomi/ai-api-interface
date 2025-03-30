import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import ApiConnectionCard from '../../components/api/ApiConnectionCard';
import ApiConnectionForm from '../../components/api/ApiConnectionForm';

const ApiConnectionManager: React.FC = () => {
  const { token, isAuthenticated } = useAuth();
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingConnection, setEditingConnection] = useState<any>(null);

  // Fetch API connections on component mount
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchConnections();
    }
  }, [isAuthenticated, token]);

  // Fetch API connections from backend
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
        throw new Error('Failed to fetch API connections');
      }

      const data = await response.json();
      setConnections(data.connections || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching connections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a new connection
  const handleAddConnection = async (connectionData: any) => {
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

      // Refresh connections list
      await fetchConnections();
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding connection:', err);
    }
  };

  // Handle editing a connection
  const handleEditConnection = async (connectionData: any) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/connections/${editingConnection.id}`, {
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

      // Refresh connections list
      await fetchConnections();
      setEditingConnection(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating connection:', err);
    }
  };

  // Handle deleting a connection
  const handleDeleteConnection = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this API connection?')) {
      return;
    }
    
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

      // Refresh connections list
      await fetchConnections();
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting connection:', err);
    }
  };

  // Handle testing a connection
  const handleTestConnection = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/proxy/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          endpoint: 'health',
          method: 'GET'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Connection test failed');
      }

      alert('Connection test successful!');
    } catch (err: any) {
      setError(err.message);
      console.error('Error testing connection:', err);
      alert(`Connection test failed: ${err.message}`);
    }
  };

  // Handle form submission
  const handleFormSubmit = (data: any) => {
    if (editingConnection) {
      handleEditConnection(data);
    } else {
      handleAddConnection(data);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowAddForm(false);
    setEditingConnection(null);
  };

  // Handle edit button click
  const handleEditClick = (id: string) => {
    const connection = connections.find((conn: any) => conn.id === id);
    if (connection) {
      setEditingConnection(connection);
    }
  };

  // Add sample connections (for testing)
  const handleAddSampleConnections = async () => {
    try {
      setError(null);
      
      const response = await fetch('/api/connections/samples', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add sample connections');
      }

      // Refresh connections list
      await fetchConnections();
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding sample connections:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[var(--intel-blue-primary)]">
          API Connections
        </h1>
        <div className="flex space-x-2">
          <button 
            className="btn-secondary"
            onClick={handleAddSampleConnections}
          >
            Add Samples
          </button>
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            Add New Connection
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {(showAddForm || editingConnection) && (
        <ApiConnectionForm 
          isEdit={!!editingConnection}
          initialData={editingConnection || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading API connections...</p>
        </div>
      ) : connections.length === 0 ? (
        <div className="card text-center py-8">
          <p className="text-gray-600 mb-4">No API connections found.</p>
          <p className="text-gray-600">
            Click "Add New Connection" to add your first API connection or "Add Samples" to add sample connections.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {connections.map((connection: any) => (
            <ApiConnectionCard
              key={connection.id}
              id={connection.id}
              name={connection.name}
              status={connection.status || 'connected'}
              lastUsed={connection.lastUsed}
              onEdit={() => handleEditClick(connection.id)}
              onTest={() => handleTestConnection(connection.id)}
              onDelete={() => handleDeleteConnection(connection.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiConnectionManager;
