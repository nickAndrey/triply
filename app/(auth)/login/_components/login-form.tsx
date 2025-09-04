'use client';

import { Button } from '@/chadcn/components/ui/button';
import { Input } from '@/chadcn/components/ui/input';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';
import { useActionState } from 'react';
import { login } from '../_actions/login';

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, {
    success: false,
    fields: {
      email: '',
      password: '',
    },
  });

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 w-xl bg-secondary px-6 py-4 rounded-xl shadow-xl"
    >
      <h4 className="text-lg font-semibold">Login</h4>

      <div className="flex flex-col gap-2">
        <label>Email:</label>
        <Input
          className={clsx('bg-background shadow', state?.errors?.email ? 'border-destructive' : '')}
          name="email"
          placeholder="Provide an email..."
          type="email"
          defaultValue={state.fields.email}
          autoComplete="username"
        />
        {state?.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email.errors[0]}</p>
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
          <p className="text-sm text-destructive">{state.errors.password.errors[0]}</p>
        )}
      </div>

      {state?.apiError && <p className="text-sm text-destructive">{state.apiError}</p>}

      <Button type="submit" className="py-5 flex items-center gap-3" disabled={isPending}>
        {isPending ? (
          <>
            <LoaderCircle className="animate-spin" />
            <span>Logging in</span>
          </>
        ) : (
          'Log in'
        )}
      </Button>
    </form>
  );
}
