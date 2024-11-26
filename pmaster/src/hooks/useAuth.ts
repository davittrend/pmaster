import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/auth';
import { TokenManager } from '../lib/auth';
import { PINTEREST_CONFIG } from '../config/pinterest';

export function useAuth() {
  const { auth, setAuth } = useAuthStore();

  const refreshToken = useCallback(async () => {
    if (!auth?.refresh_token) return;

    try {
      const response = await fetch(PINTEREST_CONFIG.TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(
            `${PINTEREST_CONFIG.CLIENT_ID}:${PINTEREST_CONFIG.CLIENT_SECRET}`
          )}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: auth.refresh_token,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const newAuth = await response.json();
      TokenManager.getInstance().setTokenExpiry(newAuth.expires_in);
      setAuth(newAuth);
    } catch (error) {
      console.error('Token refresh failed:', error);
      setAuth(null); // Clear auth state on refresh failure
    }
  }, [auth?.refresh_token, setAuth]);

  useEffect(() => {
    const handleTokenRefresh = () => {
      refreshToken();
    };

    window.addEventListener('pinterest-token-refresh-needed', handleTokenRefresh);

    return () => {
      window.removeEventListener('pinterest-token-refresh-needed', handleTokenRefresh);
      TokenManager.getInstance().cleanup();
    };
  }, [refreshToken]);

  return { auth, refreshToken };
}