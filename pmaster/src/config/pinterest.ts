import { z } from 'zod';

const envSchema = z.object({
  VITE_PINTEREST_CLIENT_ID: z.string(),
  VITE_PINTEREST_CLIENT_SECRET: z.string(),
  VITE_PINTEREST_REDIRECT_URI: z.string().url(),
});

// Validate environment variables
const env = envSchema.parse({
  VITE_PINTEREST_CLIENT_ID: import.meta.env.VITE_PINTEREST_CLIENT_ID,
  VITE_PINTEREST_CLIENT_SECRET: import.meta.env.VITE_PINTEREST_CLIENT_SECRET,
  VITE_PINTEREST_REDIRECT_URI: import.meta.env.VITE_PINTEREST_REDIRECT_URI,
});

export const PINTEREST_CONFIG = {
  API_BASE_URL: 'https://api.pinterest.com/v5',
  CLIENT_ID: env.VITE_PINTEREST_CLIENT_ID,
  CLIENT_SECRET: env.VITE_PINTEREST_CLIENT_SECRET,
  REDIRECT_URI: env.VITE_PINTEREST_REDIRECT_URI,
  SCOPES: [
    'boards:read',
    'pins:read',
    'pins:write',
    'user_accounts:read',
  ] as const,
  TOKEN_ENDPOINT: 'https://api.pinterest.com/v5/oauth/token',
  AUTH_ENDPOINT: 'https://www.pinterest.com/oauth/',
} as const;