import MainLayout from '../../components/layout/MainLayout';

export default function ApiServices() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[var(--intel-blue-primary)]">
            API Services
          </h1>
          <button className="btn-primary">
            Add New API Service
          </button>
        </div>
        
        <div className="card mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-2">
                OpenAI API
              </h3>
              <p className="text-gray-700 mb-2">
                Status: <span className="text-green-600 font-medium">Connected</span>
              </p>
              <p className="text-sm text-gray-600">
                Last used: Today at 14:30
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="btn-secondary">Edit</button>
              <button className="btn-secondary">Test</button>
            </div>
          </div>
        </div>
        
        <div className="card mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-2">
                Azure OpenAI Service
              </h3>
              <p className="text-gray-700 mb-2">
                Status: <span className="text-green-600 font-medium">Connected</span>
              </p>
              <p className="text-sm text-gray-600">
                Last used: Yesterday at 09:15
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="btn-secondary">Edit</button>
              <button className="btn-secondary">Test</button>
            </div>
          </div>
        </div>
        
        <div className="card mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-2">
                Google AI API
              </h3>
              <p className="text-gray-700 mb-2">
                Status: <span className="text-yellow-600 font-medium">Configuration Required</span>
              </p>
              <p className="text-sm text-gray-600">
                Never used
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="btn-secondary">Configure</button>
              <button className="btn-secondary" disabled>Test</button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
