import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useRefreshToken } from '../hooks/useRefreshToken';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { auth } = useAuthStore();
  const navigate = useNavigate();
  useRefreshToken();

  // Check authentication status on mount and route changes
  useEffect(() => {
    const publicRoutes = ['/login', '/callback', '/'];
    const currentPath = window.location.pathname;

    if (!auth && !publicRoutes.includes(currentPath)) {
      navigate('/login', { replace: true });
    }
  }, [auth, navigate]);

  return <>{children}</>;
}