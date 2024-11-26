import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Loader } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { handleAuthResponse } from '../lib/auth';

export function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error || !code || !state) {
      setError(errorDescription || 'Authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    const completeAuth = async () => {
      try {
        const auth = await handleAuthResponse(code, state);
        setAuth(auth);
        navigate('/accounts', { replace: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : 
          'Failed to authenticate with Pinterest. Please try again.';
        setError(message);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    completeAuth();
  }, [searchParams, setAuth, navigate]);

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <p className="text-sm text-gray-500 text-center">
            Redirecting you back to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center text-pink-500 mb-4">
          <Loader className="h-12 w-12 animate-spin" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
          Connecting to Pinterest
        </h2>
        <p className="text-gray-600 text-center">
          Please wait while we set up your account...
        </p>
      </div>
    </div>
  );
}