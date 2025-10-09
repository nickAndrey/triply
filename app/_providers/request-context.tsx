'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

import { toast } from 'sonner';

type RequestState = {
  isPending: boolean;
  status: 'idle' | 'pending' | 'success' | 'error';
  result?: unknown;
  onSetMessage?: (params: { start?: ReactNode; finish?: ReactNode; fail?: ReactNode }) => void;
  start: (message?: string) => void;
  finish: (params?: { res?: unknown; message?: string }) => void;
  fail: (message?: string) => void;
};

const RequestContext = createContext<RequestState | null>(null);

export function RequestProvider({ children }: { children: ReactNode }) {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<unknown>(null);
  const [customMessage, setCustomMessage] = useState<{
    start?: ReactNode;
    finish?: ReactNode;
    fail?: ReactNode;
  }>({});

  const start = (message?: string) => {
    setIsPending(true);
    setStatus('pending');
    setResult(null);

    // Set [start] message:
    const _msg = customMessage.start || message;
    if (_msg) toast.info(_msg);
    // ---
  };
  const finish = (params?: { res?: unknown; message?: string }) => {
    setIsPending(false);
    setStatus('success');
    setResult(params?.res);

    // Set [finish] message:
    const _msg = customMessage.finish || params?.message;
    if (_msg) toast.success(_msg);
    // ---
  };
  const fail = (message?: string) => {
    setIsPending(false);
    setStatus('error');
    setResult(null);

    // Set [fail] message:
    const _msg = customMessage.fail || message;
    if (_msg) toast.error(_msg);
    // ---
  };

  return (
    <RequestContext.Provider
      value={{
        isPending,
        status,
        result,
        start,
        finish,
        fail,
        onSetMessage: (params) => {
          return setCustomMessage((prev) => ({ ...prev, ...params }));
        },
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
