'use client';

import { login } from '@/app/_actions/login';
import { Button } from '@/chadcn/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/chadcn/components/ui/card';
import { Input } from '@/chadcn/components/ui/input';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {
    success: false,
    fields: {
      email: '',
      password: '',
    },
  });

  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Use your registered email and password to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label>Email:</label>
            <Input
              className={clsx(
                'bg-background shadow',
                state?.errors?.email ? 'border-destructive' : ''
              )}
              name="email"
              placeholder="Provide an email..."
              type="email"
              defaultValue={state.fields.email}
              autoComplete="username"
            />
            {state?.errors?.email && (
              <p className="text-sm text-destructive">
                {state.errors.email.errors[0]}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label>Password:</label>
            <Input
              className={clsx(
                'bg-background shadow',
                state?.errors?.password ? 'border-destructive' : ''
              )}
              name="password"
              type="password"
              placeholder="Provide a password..."
              defaultValue={state.fields.password}
              autoComplete="new-password"
            />
            {state?.errors?.password && (
              <p className="text-sm text-destructive">
                {state.errors.password.errors[0]}
              </p>
            )}
            <Link
              href="/forgot-password"
              className="text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {state?.apiError && (
            <p className="text-sm text-destructive">{state.apiError}</p>
          )}

          <Button
            type="submit"
            className="py-5 flex items-center gap-3"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <LoaderCircle className="animate-spin" />
                <span>Logging in</span>
              </>
            ) : (
              'Log in'
            )}
          </Button>
          <p className="text-sm flex items-center gap-2 ml-auto">
            Don&apos;t have an account?
            <Link href="/signup" className="hover:underline font-bold">
              Sign up now
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
