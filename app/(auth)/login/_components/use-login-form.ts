'use client';

import { FormEventHandler, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { login } from '@server-actions/login';

import { useRequest } from '@providers/request-context';

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Field is required'),
});

type FormFields = z.infer<typeof schema>;

export function useLoginForm() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const router = useRouter();
  const { isPending, start, finish, fail } = useRequest();

  const [generalError, setGeneralError] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const isFormValid = await form.trigger();
    if (!isFormValid) return;

    start('Trying to log you in, please wait ...');

    const result = await login(form.getValues());

    if (result.user) {
      setGeneralError('');
      finish('Login successful! Redirecting…');
      setTimeout(() => router.push('/'), 2000);
    }

    if (result.errors) {
      fail('Login failed. Please check credentials and try again.');

      if ('email' in result.errors) {
        form.setError('email', {
          type: 'server',
          message: result.errors.email?.errors[0],
        });
      }

      if ('password' in result.errors) {
        form.setError('password', {
          type: 'server',
          message: result.errors.password?.errors[0],
        });
      }

      if ('invalid_credentials' in result.errors) {
        setGeneralError(
          result.errors.invalid_credentials?.errors[0] ||
            'Invalid credentials was provided. Please check your email and password.'
        );
      }

      if ('email_not_confirmed' in result.errors) {
        setGeneralError(
          result.errors.email_not_confirmed?.errors[0] ||
            'Email was not confirmed. Please confirm an email and try login again.'
        );
      }
    }
  };

  return {
    form,
    isPending,
    generalError,
    handleSubmit,
  };
}
