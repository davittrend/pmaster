export class PinterestApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: number
  ) {
    super(message);
    this.name = 'PinterestApiError';
  }
}