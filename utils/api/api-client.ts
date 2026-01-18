type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiClientOptions {
  baseUrl?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(options?: ApiClientOptions) {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!envUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
    }
    this.baseUrl = options?.baseUrl ?? envUrl;
  }

  private async request<T>(params: {
    path: string;
    method: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
  }): Promise<T> {
    const response = await fetch(`${this.baseUrl}${params.path}`, {
      method: params.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...params.headers,
      },
      body: params.body ? JSON.stringify(params.body) : undefined,
    });

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

  post<T>(path: string, body?: unknown) {
    return this.request<T>({ path, method: 'POST', body });
  }
}
