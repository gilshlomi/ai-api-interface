import React, { useState } from 'react';

interface ApiConnectionFormProps {
  isEdit?: boolean;
  initialData?: {
    id?: string;
    name: string;
    endpoint: string;
    authType: string;
    apiKey?: string;
    username?: string;
    password?: string;
    rateLimit?: number;
  };
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ApiConnectionForm: React.FC<ApiConnectionFormProps> = ({
  isEdit = false,
  initialData = {
    name: '',
    endpoint: '',
    authType: 'apiKey',
    apiKey: '',
    username: '',
    password: '',
    rateLimit: 60
  },
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.endpoint.trim()) {
      newErrors.endpoint = 'API Endpoint is required';
    } else if (!/^https?:\/\/.+/.test(formData.endpoint)) {
      newErrors.endpoint = 'API Endpoint must be a valid URL starting with http:// or https://';
    }
    
    if (formData.authType === 'apiKey' && !formData.apiKey?.trim()) {
      newErrors.apiKey = 'API Key is required';
    }
    
    if (formData.authType === 'basic') {
      if (!formData.username?.trim()) {
        newErrors.username = 'Username is required';
      }
      if (!formData.password?.trim()) {
        newErrors.password = 'Password is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-4">
        {isEdit ? 'Edit API Connection' : 'Add New API Connection'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Connection Name*
          </label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            className={`input-field ${errors.name ? 'border-red-500' : ''}`}
            placeholder="e.g., OpenAI GPT-4"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-1">
            API Endpoint URL*
          </label>
          <input 
            type="text" 
            id="endpoint" 
            name="endpoint" 
            value={formData.endpoint} 
            onChange={handleChange}
            className={`input-field ${errors.endpoint ? 'border-red-500' : ''}`}
            placeholder="https://api.example.com/v1"
          />
          {errors.endpoint && <p className="text-red-500 text-xs mt-1">{errors.endpoint}</p>}
        </div>
        
        <div>
          <label htmlFor="authType" className="block text-sm font-medium text-gray-700 mb-1">
            Authentication Type*
          </label>
          <select 
            id="authType" 
            name="authType" 
            value={formData.authType} 
            onChange={handleChange}
            className="input-field"
          >
            <option value="apiKey">API Key</option>
            <option value="basic">Basic Auth</option>
            <option value="oauth">OAuth 2.0</option>
            <option value="none">No Authentication</option>
          </select>
        </div>
        
        {formData.authType === 'apiKey' && (
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              API Key*
            </label>
            <input 
              type="password" 
              id="apiKey" 
              name="apiKey" 
              value={formData.apiKey} 
              onChange={handleChange}
              className={`input-field ${errors.apiKey ? 'border-red-500' : ''}`}
              placeholder="Enter your API key"
            />
            {errors.apiKey && <p className="text-red-500 text-xs mt-1">{errors.apiKey}</p>}
          </div>
        )}
        
        {formData.authType === 'basic' && (
          <>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username*
              </label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={formData.username} 
                onChange={handleChange}
                className={`input-field ${errors.username ? 'border-red-500' : ''}`}
                placeholder="Username"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password*
              </label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange}
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </>
        )}
        
        <div>
          <label htmlFor="rateLimit" className="block text-sm font-medium text-gray-700 mb-1">
            Rate Limit (requests per minute)
          </label>
          <input 
            type="number" 
            id="rateLimit" 
            name="rateLimit" 
            value={formData.rateLimit} 
            onChange={handleChange}
            className="input-field"
            min="1"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button 
            type="button" 
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
          >
            {isEdit ? 'Update Connection' : 'Add Connection'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApiConnectionForm;
