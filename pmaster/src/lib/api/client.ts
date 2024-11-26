import { PINTEREST_CONFIG } from '../../config/pinterest';
import { PinterestApiError } from './errors';
import type { RequestOptions } from './types';

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = PINTEREST_CONFIG.API_BASE_URL;
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (options.accessToken) {
      headers.Authorization = `Bearer ${options.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new PinterestApiError(
          data.message || 'API request failed',
          response.status,
          data.code
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof PinterestApiError) {
        throw error;
      }
      throw new PinterestApiError('Failed to complete request');
    }
  }
}