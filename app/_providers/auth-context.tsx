'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { useRequest } from '@providers/request-context';

import { api, API_PATHS } from '@/utils/api';

export type User = {
  name: string;
  email: string;
};

type AuthContextState = {
  user: User | null;
  loading: boolean;
  error: 'NETWORK_ERROR' | null;
  handleLogOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { start, fail, finish } = useRequest();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthContextState['error']>(null);

  // Called when refresh fails or session is revoked
  useEffect(() => {
    api.setUnauthorizedCallback(() => {
      setUser(null);
      router.push('/login');
    });
  }, [router]);

  const handleLogOut = async () => {
    try {
      start();
      await api.post(API_PATHS.auth.logout);
      setUser(null);
      router.push('/login');
    } catch {
      fail('Unable to logout user');
    } finally {
      finish();
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get<{ data: { user: User } }>(API_PATHS.users.me, {
          skipRefresh: true,
        });
        setUser(response.data.user);
      } catch {
        setError('NETWORK_ERROR');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
