// utils/api/api-client.ts
import { API_PATHS } from '@/utils/api/api-paths';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiClient {
  private baseUrl: string;
  private accessToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;
  private onUnauthorized?: () => void;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Public method to set token
  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  // Public method to get token
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Public method to set unauthorized callback
  setUnauthorizedCallback(callback: () => void) {
    this.onUnauthorized = callback;
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}${API_PATHS.auth.refresh}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Refresh failed');
        }

        const data = await response.json();
        this.accessToken = data.accessToken;
        return data.accessToken;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(params: {
    path: string;
    method: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    isRetry?: boolean;
  }): Promise<T> {
    // Automatically add token if available
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...params.headers,
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${params.path}`, {
      method: params.method,
      credentials: 'include',
      headers,
      body: params.body ? JSON.stringify(params.body) : undefined,
    });

    // Handle 401 - refresh and retry
    if (response.status === 401 && !params.isRetry && params.path !== API_PATHS.auth.refresh) {
      try {
        await this.refreshAccessToken();
        return this.request<T>({ ...params, isRetry: true });
      } catch (error) {
        this.accessToken = null;
        this.onUnauthorized?.();
        throw new Error('Session expired. Please log in again.');
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message ?? 'Request failed');
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return response.json();
    }

    return undefined as T;
  }

  get<T>(path: string, headers?: Record<string, string>) {
    return this.request<T>({ path, method: 'GET', headers });
  }

  post<T>(path: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>({ path, method: 'POST', body, headers });
  }
}
