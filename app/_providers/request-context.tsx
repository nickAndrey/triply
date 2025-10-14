'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

import { toast } from 'sonner';

type RequestState = {
  isPending: boolean;
  status: 'idle' | 'pending' | 'success' | 'error';
  start: (message?: ReactNode) => void;
  finish: (message?: ReactNode) => void;
  fail: (message?: ReactNode) => void;
};

const RequestContext = createContext<RequestState | null>(null);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const start = (message?: ReactNode) => {
    setIsPending(true);
    setStatus('pending');
    toast.info(message);
  };
  const finish = (message?: ReactNode) => {
    setIsPending(false);
    setStatus('success');
    toast.success(message);
  };
  const fail = (message?: ReactNode) => {
    setIsPending(false);
    setStatus('error');
    toast.error(message);
  };

  return (
    <RequestContext.Provider
      value={{
        isPending,
        status,
        start,
        finish,
        fail,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
}

export function useRequest() {
  const ctx = useContext(RequestContext);
  if (!ctx) throw new Error('useRequest must be used within RequestProvider');
  return ctx;
}
