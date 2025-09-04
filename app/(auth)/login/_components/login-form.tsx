'use client';

import { Button } from '@/chadcn/components/ui/button';
import { Input } from '@/chadcn/components/ui/input';
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
      className="flex flex-col gap-6 w-xl bg-secondary/50 px-6 py-4 rounded-md"
    >
      <h4 className="text-lg font-semibold">Login</h4>

      <div className="flex flex-col gap-2">
        <label>Email</label>
        <Input
          name="email"
          placeholder="email"
          type="email"
          defaultValue={state.fields.email}
          autoComplete="username"
        />
        {state?.errors?.email && (
          <p className="text-sm text-red-500">{state.errors.email.errors[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label>Password</label>
        <Input
          name="password"
          type="password"
          placeholder="password"
          defaultValue={state.fields.password}
          autoComplete="new-password"
        />
        {state?.errors?.password && (
          <p className="text-sm text-red-500">{state.errors.password.errors[0]}</p>
        )}
      </div>

      {state?.apiError && <p className="text-sm text-red-500">{state.apiError}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Loading…' : 'Log in'}
      </Button>
    </form>
  );
}
