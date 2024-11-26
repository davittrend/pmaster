export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  accessToken?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
}