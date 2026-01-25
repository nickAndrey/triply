import { API_PATHS } from '@/constants/paths';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type InternalRequestParams = {
  path: string;
  method: HttpMethod;
  body?: unknown;
  isRetry?: boolean;
  skipRefresh?: boolean;
};

type PublicRequestOptions = {
  skipRefresh?: boolean;
};

export class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<void> | null = null;
  private onUnauthorized?: () => void;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setUnauthorizedCallback(callback: () => void) {
    this.onUnauthorized = callback;
  }

  private async refreshSession(): Promise<void> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${this.baseUrl}${API_PATHS.auth.refresh}`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Refresh failed');
        }
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async request<T>(params: InternalRequestParams): Promise<T> {
    const response = await fetch(`${this.baseUrl}${params.path}`, {
      method: params.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: params.body ? JSON.stringify(params.body) : undefined,
    });

    const isAllowedRefreshSession =
      response.status === 401 && !params.isRetry && !params.skipRefresh && params.path !== API_PATHS.auth.refresh;

    if (isAllowedRefreshSession) {
      try {
        await this.refreshSession();
        return this.request<T>({ ...params, isRetry: true });
      } catch {
        if (!params.skipRefresh) {
          this.onUnauthorized?.();
        }
        throw new Error('Session expired');
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

  get<T>(path: string, options?: PublicRequestOptions) {
    return this.request<T>({
      path,
      method: 'GET',
      skipRefresh: options?.skipRefresh,
    });
  }

  post<T>(path: string, body?: unknown, options?: PublicRequestOptions) {
    return this.request<T>({
      path,
      method: 'POST',
      body,
      skipRefresh: options?.skipRefresh,
    });
  }
}
