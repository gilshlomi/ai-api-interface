import React, { useState } from 'react';

interface ApiRequestPanelProps {
  connectionId: string;
  connectionName: string;
  endpoints: string[];
}

const ApiRequestPanel: React.FC<ApiRequestPanelProps> = ({
  connectionId,
  connectionName,
  endpoints = ['chat/completions', 'images/generations', 'embeddings']
}) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [requestBody, setRequestBody] = useState('{\n  "model": "gpt-4",\n  "messages": [\n    {\n      "role": "user",\n      "content": "Hello, how can you help me today?"\n    }\n  ]\n}');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEndpointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEndpoint(e.target.value);
    
    // Set default request body based on selected endpoint
    if (e.target.value === 'chat/completions') {
      setRequestBody('{\n  "model": "gpt-4",\n  "messages": [\n    {\n      "role": "user",\n      "content": "Hello, how can you help me today?"\n    }\n  ]\n}');
    } else if (e.target.value === 'images/generations') {
      setRequestBody('{\n  "model": "dall-e-3",\n  "prompt": "A beautiful sunset over mountains",\n  "n": 1,\n  "size": "1024x1024"\n}');
    } else if (e.target.value === 'embeddings') {
      setRequestBody('{\n  "model": "text-embedding-ada-002",\n  "input": "The food was delicious and the service was excellent."\n}');
    }
  };

  const handleSendRequest = () => {
    setIsLoading(true);
    setError('');
    
    // Simulate API request
    setTimeout(() => {
      try {
        // Validate JSON
        JSON.parse(requestBody);
        
        // Mock response based on endpoint
        if (selectedEndpoint === 'chat/completions') {
          setResponse(JSON.stringify({
            id: 'chatcmpl-123',
            object: 'chat.completion',
            created: Date.now(),
            model: 'gpt-4',
            choices: [
              {
                index: 0,
                message: {
                  role: 'assistant',
                  content: 'Hello! I\'m an AI assistant. I can help you with information, answer questions, assist with tasks like writing or brainstorming, explain concepts, or just chat. How can I assist you today?'
                },
                finish_reason: 'stop'
              }
            ],
            usage: {
              prompt_tokens: 16,
              completion_tokens: 39,
              total_tokens: 55
            }
          }, null, 2));
        } else if (selectedEndpoint === 'images/generations') {
          setResponse(JSON.stringify({
            created: Date.now(),
            data: [
              {
                url: 'https://example.com/images/generated-image.jpg',
                revised_prompt: 'A beautiful sunset over snow-capped mountains with orange and purple sky'
              }
            ]
          }, null, 2));
        } else if (selectedEndpoint === 'embeddings') {
          setResponse(JSON.stringify({
            object: 'list',
            data: [
              {
                object: 'embedding',
                embedding: [0.0023064255, -0.009327292, 0.015797347, -0.007114646],
                index: 0
              }
            ],
            model: 'text-embedding-ada-002',
            usage: {
              prompt_tokens: 8,
              total_tokens: 8
            }
          }, null, 2));
        }
        
        setIsLoading(false);
      } catch (err) {
        setError('Invalid JSON in request body');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-4">
        API Request - {connectionName}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700 mb-1">
            Endpoint
          </label>
          <select 
            id="endpoint" 
            value={selectedEndpoint} 
            onChange={handleEndpointChange}
            className="input-field"
          >
            {endpoints.map(endpoint => (
              <option key={endpoint} value={endpoint}>{endpoint}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="requestBody" className="block text-sm font-medium text-gray-700 mb-1">
            Request Body
          </label>
          <textarea 
            id="requestBody" 
            value={requestBody} 
            onChange={(e) => setRequestBody(e.target.value)}
            className="input-field font-mono text-sm h-48"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        
        <div className="flex justify-end">
          <button 
            onClick={handleSendRequest}
            disabled={isLoading}
            className="btn-primary"
          >
            {isLoading ? 'Sending...' : 'Send Request'}
          </button>
        </div>
        
        {response && (
          <div>
            <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-1">
              Response
            </label>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto h-64 text-sm">
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiRequestPanel;
