import { ApiClient } from './api-client';

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
}

export const api = new ApiClient(baseUrl);
