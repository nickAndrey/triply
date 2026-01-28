import { cookies } from 'next/headers';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ServerRequestParams = {
  path: string;
  method: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
};

class ServerApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>({ path, method, body, headers, cache = 'no-store' }: ServerRequestParams): Promise<T> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      cache,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401) {
      // Let the caller decide how to handle auth failures
      throw new Error('UNAUTHORIZED');
    }

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(error?.message ?? 'Request failed');
    }

    if (res.status === 204) {
      return undefined as T;
    }

    const contentType = res.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return res.json();
    }

    return undefined as T;
  }

  get<T>(path: string, options?: { cache?: RequestCache }) {
    return this.request<T>({
      path,
      method: 'GET',
      cache: options?.cache,
    });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>({
      path,
      method: 'POST',
      body,
    });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>({
      path,
      method: 'PUT',
      body,
    });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>({
      path,
      method: 'PATCH',
      body,
    });
  }

  delete<T>(path: string) {
    return this.request<T>({
      path,
      method: 'DELETE',
    });
  }
}

const baseUrl = process.env.BACKEND_URL;
if (!baseUrl) {
  throw new Error('BACKEND_URL is not defined');
}

export const serverApiClient = new ServerApiClient(baseUrl);
