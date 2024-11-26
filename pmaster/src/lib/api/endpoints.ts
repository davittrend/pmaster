import { ApiClient } from './client';
import type { PinterestAuth, PinterestBoard, PinterestUser, PinterestPin, CreatePinResponse } from '../../types/pinterest';
import { PINTEREST_CONFIG } from '../../config/pinterest';

export const auth = {
  exchangeCode: async (code: string): Promise<PinterestAuth> => {
    const response = await fetch(PINTEREST_CONFIG.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(
          `${PINTEREST_CONFIG.CLIENT_ID}:${PINTEREST_CONFIG.CLIENT_SECRET}`
        )}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: PINTEREST_CONFIG.REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    return response.json();
  },

  refreshToken: async (refreshToken: string): Promise<PinterestAuth> => {
    const response = await fetch(PINTEREST_CONFIG.TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(
          `${PINTEREST_CONFIG.CLIENT_ID}:${PINTEREST_CONFIG.CLIENT_SECRET}`
        )}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return response.json();
  },
};

export const boards = {
  getAll: async (accessToken: string): Promise<PinterestBoard[]> => {
    const client = ApiClient.getInstance();
    let allBoards: PinterestBoard[] = [];
    let bookmark: string | undefined;

    do {
      const params = new URLSearchParams({
        page_size: '100',
        ...(bookmark && { bookmark }),
      });

      const response = await client.request<{ items: PinterestBoard[]; bookmark?: string }>(
        `/boards?${params}`,
        { accessToken }
      );

      allBoards = [...allBoards, ...response.items];
      bookmark = response.bookmark;
    } while (bookmark);

    return allBoards.sort((a, b) => a.name.localeCompare(b.name));
  },
};

export const users = {
  getProfile: async (accessToken: string): Promise<PinterestUser> => {
    const client = ApiClient.getInstance();
    return client.request<PinterestUser>('/user_account', { accessToken });
  },
};

export const pins = {
  create: async (accessToken: string, pin: PinterestPin): Promise<CreatePinResponse> => {
    const client = ApiClient.getInstance();
    return client.request<CreatePinResponse>('/pins', {
      method: 'POST',
      accessToken,
      body: {
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
      },
    });
  },
};