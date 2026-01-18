'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { CheckCircle2Icon, Loader2, OctagonAlert } from 'lucide-react';

import { useRequest } from '@providers/request-context';

import { Alert, AlertDescription, AlertTitle } from '@chadcn/components/ui/alert';
import { Button } from '@chadcn/components/ui/button';
import { Input } from '@chadcn/components/ui/input';

import { api, API_PATHS } from '@/utils/api';

type EmailVerificationProps = {
  token: string;
};

type VerificationStatus = 'verifying' | 'success' | 'error' | 'resend-success';

export function EmailVerification({ token }: EmailVerificationProps) {
  const { start, finish } = useRequest();

  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        start();
        const response = await api.post<{ message: string }>(API_PATHS.auth.verifyEmail, {
          emailVerificationToken: token,
        });

        setMessage(response.message);
        setStatus('success');
      } catch (error) {
        console.error(error);
        setStatus('error');
      } finally {
        finish();
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendEmail = async () => {
    try {
      start();
      const response = await api.post<{ message: string }>(API_PATHS.auth.resendEmail, { email });

      setMessage(response.message);
      setStatus('resend-success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      finish();
    }
  };

  const renderIcon = () => {
    if (status === 'verifying') return <Loader2 className="size-9 animate-spin" />;
    if (status === 'error') return <OctagonAlert className="size-9" />;
    return <CheckCircle2Icon className="size-9" />;
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return <p>Verifying your email address…</p>;

      case 'success':
        return (
          <div className="space-y-2">
            <p>{message}</p>
            <Link href="/login" className="underline">
              Back to login
            </Link>
          </div>
        );

      case 'resend-success':
        return (
          <div className="space-y-2">
            <p>{message}</p>
            <p>Please check your inbox.</p>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-3">
            <p>Failed to verify your email.</p>

            <Input
              placeholder="Enter your email to resend verification"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button size="sm" onClick={handleResendEmail} disabled={!email}>
              Resend verification email
            </Button>
          </div>
        );
    }
  };

  return (
    <Alert className="max-w-md grid grid-cols-[auto_1fr] items-start gap-3">
      <div className="w-9 mt-1">{renderIcon()}</div>

      <div>
        <AlertTitle>Email verification</AlertTitle>
        <AlertDescription>{renderContent()}</AlertDescription>
      </div>
    </Alert>
  );
}
