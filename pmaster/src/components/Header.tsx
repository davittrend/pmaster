import React from 'react';
import { Link } from 'react-router-dom';
import { Pin } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export function Header() {
  const { auth } = useAuthStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Pin className="h-8 w-8 text-pink-500" />
          <span className="text-xl font-bold text-gray-900">Pin Master</span>
        </Link>
        
        <nav className="flex items-center space-x-6">
          {auth ? (
            <>
              <Link to="/accounts" className="text-gray-600 hover:text-gray-900">
                Accounts
              </Link>
              <Link to="/schedulepins" className="text-gray-600 hover:text-gray-900">
                Schedule Pins
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
            >
              Login with Pinterest
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}