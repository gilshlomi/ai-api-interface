import MainLayout from '../../components/layout/MainLayout';

export default function Settings() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[var(--intel-blue-primary)] mb-6">
          Settings
        </h1>
        
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-4">
            Application Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select id="theme" className="input-field">
                <option>Intel Blue (Default)</option>
                <option>Dark Mode</option>
                <option>Light Mode</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select id="language" className="input-field">
                <option>English (Default)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input type="checkbox" id="notifications" className="mr-2" />
              <label htmlFor="notifications" className="text-sm font-medium text-gray-700">
                Enable Notifications
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>
        
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-4">
            API Default Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="timeout" className="block text-sm font-medium text-gray-700 mb-1">
                Default Request Timeout (seconds)
              </label>
              <input type="number" id="timeout" defaultValue={30} className="input-field" />
            </div>
            
            <div>
              <label htmlFor="retries" className="block text-sm font-medium text-gray-700 mb-1">
                Default Retry Attempts
              </label>
              <input type="number" id="retries" defaultValue={3} className="input-field" />
            </div>
            
            <div>
              <label htmlFor="logging" className="block text-sm font-medium text-gray-700 mb-1">
                Logging Level
              </label>
              <select id="logging" className="input-field">
                <option>Info</option>
                <option>Warning</option>
                <option>Error</option>
                <option>Debug</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
