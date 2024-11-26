import { useEffect } from 'react';
import { useAuthStore } from '../store/auth';
import { refreshToken } from '../lib/api';

const REFRESH_INTERVAL = 27 * 24 * 60 * 60 * 1000; // 27 days in milliseconds

export function useRefreshToken() {
  const { auth, setAuth } = useAuthStore();

  useEffect(() => {
    if (!auth?.refresh_token) return;

    const refreshTokenTimer = setInterval(async () => {
      try {
        const newAuth = await refreshToken(auth.refresh_token);
        setAuth(newAuth);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        setAuth(null);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(refreshTokenTimer);
  }, [auth?.refresh_token, setAuth]);
}