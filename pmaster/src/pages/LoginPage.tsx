import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pin } from 'lucide-react';
import { getAuthUrl } from '../lib/api';

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = getAuthUrl();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <Pin className="mx-auto h-12 w-12 text-pink-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to Pin Master
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Connect your Pinterest account to get started
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={handleLogin}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            Continue with Pinterest
          </button>
        </div>
      </div>
    </div>
  );
}