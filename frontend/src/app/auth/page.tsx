import MainLayout from '../../components/layout/MainLayout';

export default function Auth() {
  return (
    <MainLayout>
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[var(--intel-blue-primary)] mb-6 text-center">
          Account
        </h1>
        
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-4">
            Login
          </h2>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input type="email" id="email" className="input-field" placeholder="your.email@example.com" />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input type="password" id="password" className="input-field" placeholder="••••••••" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-[var(--intel-blue-primary)] hover:underline">
                Forgot password?
              </a>
            </div>
            
            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-700">
              Don't have an account?{' '}
              <a href="#" className="text-[var(--intel-blue-primary)] hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-semibold text-[var(--intel-blue-primary)] mb-4">
            Single Sign-On
          </h2>
          
          <div className="space-y-3">
            <button className="btn-secondary w-full flex items-center justify-center">
              <span>Sign in with Microsoft</span>
            </button>
            
            <button className="btn-secondary w-full flex items-center justify-center">
              <span>Sign in with Google</span>
            </button>
            
            <button className="btn-secondary w-full flex items-center justify-center">
              <span>Sign in with Azure AD</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
