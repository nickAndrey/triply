'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useRequest } from '@providers/request-context';

import { API_PATHS, PUBLIC_PATHS } from '@/constants/paths';
import { api } from '@/utils/api';

export type User = {
  name: string;
  email: string;
};

type AuthContextState = {
  user: User | null;
  loading: boolean;
  handleLogOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { start, fail, finish } = useRequest();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Runtime unauthorized (refresh failed)
  useEffect(() => {
    api.setUnauthorizedCallback(() => {
      setUser(null);

      if (!PUBLIC_PATHS.has(pathname)) {
        router.push('/login');
      }
    });
  }, [router, pathname]);

  // Bootstrap auth
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get<{ user: User }>(API_PATHS.users.me);
        setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

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

  if (loading) return null;

  return <AuthContext.Provider value={{ user, loading, handleLogOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
