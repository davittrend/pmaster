import { PinterestAuth } from '../types/pinterest';
import { PINTEREST_CONFIG } from '../config/pinterest';

// Constants for token management
const TOKEN_REFRESH_BUFFER = 300000; // 5 minutes in milliseconds
const TOKEN_CHECK_INTERVAL = 60000;  // Check token every minute

export class TokenManager {
  private static instance: TokenManager;
  private refreshTimer: number | null = null;
  private tokenExpiryTime: number | null = null;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setTokenExpiry(expiresIn: number) {
    this.tokenExpiryTime = Date.now() + (expiresIn * 1000);
    this.startRefreshTimer();
  }

  private startRefreshTimer() {
    if (this.refreshTimer) {
      window.clearInterval(this.refreshTimer);
    }

    this.refreshTimer = window.setInterval(() => {
      if (this.shouldRefreshToken()) {
        this.triggerTokenRefresh();
      }
    }, TOKEN_CHECK_INTERVAL);
  }

  private shouldRefreshToken(): boolean {
    if (!this.tokenExpiryTime) return false;
    const timeUntilExpiry = this.tokenExpiryTime - Date.now();
    return timeUntilExpiry <= TOKEN_REFRESH_BUFFER;
  }

  private triggerTokenRefresh() {
    const event = new CustomEvent('pinterest-token-refresh-needed');
    window.dispatchEvent(event);
  }

  cleanup() {
    if (this.refreshTimer) {
      window.clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

export const generateAuthUrl = () => {
  // Generate a cryptographically secure random state
  const state = crypto.getRandomValues(new Uint8Array(16))
    .reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
  
  const params = new URLSearchParams({
    client_id: PINTEREST_CONFIG.CLIENT_ID,
    redirect_uri: PINTEREST_CONFIG.REDIRECT_URI,
    response_type: 'code',
    scope: PINTEREST_CONFIG.SCOPES.join(' '), // Space-separated as per OAuth2 spec
    state,
  });

  // Store state with timestamp for expiration
  const stateData = {
    value: state,
    expires: Date.now() + (10 * 60 * 1000), // 10 minutes expiration
  };
  sessionStorage.setItem('pinterest_auth_state', JSON.stringify(stateData));

  return `${PINTEREST_CONFIG.AUTH_ENDPOINT}?${params}`;
};

export const validateAuthState = (receivedState: string | null): boolean => {
  if (!receivedState) return false;

  const storedStateJson = sessionStorage.getItem('pinterest_auth_state');
  sessionStorage.removeItem('pinterest_auth_state'); // Clean up immediately

  if (!storedStateJson) return false;

  try {
    const storedState = JSON.parse(storedStateJson);
    return storedState.value === receivedState && 
           storedState.expires > Date.now();
  } catch {
    return false;
  }
};

export const handleAuthResponse = async (
  code: string,
  state: string
): Promise<PinterestAuth> => {
  if (!validateAuthState(state)) {
    throw new Error('Invalid authentication state');
  }

  const tokenResponse = await fetch(PINTEREST_CONFIG.TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(
        `${PINTEREST_CONFIG.CLIENT_ID}:${PINTEREST_CONFIG.CLIENT_SECRET}`
      )}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: PINTEREST_CONFIG.REDIRECT_URI,
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.json();
    throw new Error(error.message || 'Failed to exchange code for token');
  }

  const auth = await tokenResponse.json();
  
  // Initialize token manager with new expiry
  TokenManager.getInstance().setTokenExpiry(auth.expires_in);

  return auth;
};