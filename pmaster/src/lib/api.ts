import {
  PinterestAuth,
  PinterestBoard,
  PinterestBoardResponse,
  PinterestUser,
  PinterestPin,
  CreatePinResponse,
  PinterestErrorResponse,
} from '../types/pinterest';
import { PINTEREST_CONFIG } from '../config/pinterest';

export class PinterestApiError extends Error {
  constructor(
    message: string,
    public code?: number,
    public status?: string
  ) {
    super(message);
    this.name = 'PinterestApiError';
  }
}

export const getAuthUrl = () => {
  const state = crypto.randomUUID(); // CSRF protection
  const params = new URLSearchParams({
    client_id: PINTEREST_CONFIG.CLIENT_ID,
    redirect_uri: PINTEREST_CONFIG.REDIRECT_URI,
    response_type: 'code',
    scope: PINTEREST_CONFIG.SCOPES.join(','),
    state,
  });

  // Store state in sessionStorage for validation
  sessionStorage.setItem('pinterest_auth_state', state);

  return `${PINTEREST_CONFIG.AUTH_ENDPOINT}?${params}`;
};

export const validateState = (receivedState: string | null): boolean => {
  const savedState = sessionStorage.getItem('pinterest_auth_state');
  sessionStorage.removeItem('pinterest_auth_state'); // Clean up
  return savedState === receivedState;
};

export const exchangeCodeForToken = async (code: string): Promise<PinterestAuth> => {
  try {
    const response = await fetch(PINTEREST_CONFIG.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: PINTEREST_CONFIG.CLIENT_ID,
        client_secret: PINTEREST_CONFIG.CLIENT_SECRET,
        redirect_uri: PINTEREST_CONFIG.REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as PinterestErrorResponse;
      throw new PinterestApiError(
        errorData.message || 'Failed to exchange code for token',
        errorData.code,
        errorData.status
      );
    }

    return data as PinterestAuth;
  } catch (error) {
    if (error instanceof PinterestApiError) {
      throw error;
    }
    throw new PinterestApiError('Authentication failed. Please try again.');
  }
};

export const refreshToken = async (refresh_token: string): Promise<PinterestAuth> => {
  try {
    const response = await fetch(PINTEREST_CONFIG.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
        client_id: PINTEREST_CONFIG.CLIENT_ID,
        client_secret: PINTEREST_CONFIG.CLIENT_SECRET,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as PinterestErrorResponse;
      throw new PinterestApiError(
        errorData.message || 'Failed to refresh token',
        errorData.code,
        errorData.status
      );
    }

    return data as PinterestAuth;
  } catch (error) {
    if (error instanceof PinterestApiError) {
      throw error;
    }
    throw new PinterestApiError('Failed to refresh authentication. Please log in again.');
  }
};

export const getBoards = async (accessToken: string): Promise<PinterestBoard[]> => {
  try {
    let allBoards: PinterestBoard[] = [];
    let bookmark: string | undefined;
    
    do {
      const params = new URLSearchParams({
        page_size: '100', // Maximum allowed by Pinterest API
        ...(bookmark && { bookmark }),
      });

      const response = await fetch(
        `${PINTEREST_CONFIG.API_BASE_URL}/boards?${params}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as PinterestErrorResponse;
        throw new PinterestApiError(
          errorData.message || 'Failed to fetch boards',
          errorData.code,
          errorData.status
        );
      }

      const boardData = data as PinterestBoardResponse;
      allBoards = [...allBoards, ...boardData.items];
      bookmark = boardData.bookmark;
    } while (bookmark);

    return allBoards.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    if (error instanceof PinterestApiError) {
      throw error;
    }
    throw new PinterestApiError('Failed to load boards. Please try again.');
  }
};

export const getUserProfile = async (accessToken: string): Promise<PinterestUser> => {
  try {
    const response = await fetch(
      `${PINTEREST_CONFIG.API_BASE_URL}/user_account`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as PinterestErrorResponse;
      throw new PinterestApiError(
        errorData.message || 'Failed to fetch user profile',
        errorData.code,
        errorData.status
      );
    }

    return data as PinterestUser;
  } catch (error) {
    if (error instanceof PinterestApiError) {
      throw error;
    }
    throw new PinterestApiError('Failed to load profile information. Please try again.');
  }
};

export const createPin = async (
  accessToken: string,
  pin: PinterestPin
): Promise<CreatePinResponse> => {
  try {
    const response = await fetch(
      `${PINTEREST_CONFIG.API_BASE_URL}/pins`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          board_id: pin.boardId,
          title: pin.title,
          description: pin.description,
          link: pin.link,
          media_source: {
            source_type: 'image_url',
            url: pin.imageUrl,
          },
          ...(pin.scheduledTime && {
            publish_date: pin.scheduledTime.toISOString(),
          }),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as PinterestErrorResponse;
      throw new PinterestApiError(
        errorData.message || 'Failed to create pin',
        errorData.code,
        errorData.status
      );
    }

    return data as CreatePinResponse;
  } catch (error) {
    if (error instanceof PinterestApiError) {
      throw error;
    }
    throw new PinterestApiError('Failed to create pin. Please try again.');
  }
};