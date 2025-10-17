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
    message && toast.info(message);
    setStatus('pending');
    setIsPending(true);
  };
  const finish = (message?: ReactNode) => {
    message && toast.success(message);
    setStatus('success');
    setIsPending(false);
  };
  const fail = (message?: ReactNode) => {
    message && toast.error(message);
    setIsPending(false);
    setStatus('error');
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
