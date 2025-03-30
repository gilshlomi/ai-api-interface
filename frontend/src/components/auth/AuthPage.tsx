import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import MainLayout from '../layout/MainLayout';
import { useRouter } from 'next/router';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  return (
    <MainLayout>
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[var(--intel-blue-primary)] mb-6 text-center">
          {isLogin ? 'Sign In' : 'Create Account'}
        </h1>
        
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-700">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[var(--intel-blue-primary)] hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
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
};

export default AuthPage;
