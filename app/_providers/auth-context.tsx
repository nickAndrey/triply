'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useRequest } from '@providers/request-context';

import { api, API_PATHS } from '@/utils/api';

export type User = {
  name: string;
  email: string;
};

type AuthError = 'REFRESH_FAILED' | 'ME_FAILED' | 'NETWORK_ERROR' | null;

type AuthContextState = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: AuthError;
  setAccessToken: (token: string | null) => void;
  handleLogOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { start, fail, finish } = useRequest();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError>(null);

  const handleLogOut = async () => {
    try {
      start();
      await api.post(API_PATHS.auth.logout);
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      console.error(error);
      fail('Unable to logout user');
    } finally {
      finish();
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setError(null);

      try {
        let token = accessToken;

        // Refresh token if missing
        if (!token) {
          const refreshResponse = await api.post<{ accessToken: string }>(API_PATHS.auth.refresh);
          setAccessToken(refreshResponse.accessToken);
          token = refreshResponse.accessToken;
        }

        // Fetch user
        const userResponse = await api.get<{ data: { user: User } }>(API_PATHS.users.me, {
          Authorization: `Bearer ${token}`,
        });
        setUser(userResponse.data.user);
      } catch (err) {
        if (!error) setError('NETWORK_ERROR');
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        error,
        setAccessToken,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
