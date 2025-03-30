import MainLayout from '../components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="card">
          <h1 className="text-3xl font-bold text-[var(--intel-blue-primary)] mb-4">
            Welcome to AI API Interface
          </h1>
          <p className="text-gray-700 mb-4">
            A modern web-based graphical interface for connecting to different AI API services.
            Manage your API connections, interact with AI services, and monitor usage all in one place.
          </p>
          <button className="btn-primary">
            Get Started
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card">
            <h3 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-3">
              Connect APIs
            </h3>
            <p className="text-gray-700">
              Easily connect to multiple AI API services by entering your API details and credentials.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-3">
              Interact with AI
            </h3>
            <p className="text-gray-700">
              Send requests to AI services and view responses in a clean, intuitive interface.
            </p>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-3">
              Monitor Usage
            </h3>
            <p className="text-gray-700">
              Track API usage, view logs, and manage your connections all in one place.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
