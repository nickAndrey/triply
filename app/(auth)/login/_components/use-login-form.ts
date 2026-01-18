'use client';

import { FormEventHandler, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAuth } from '@providers/auth-context';
import { useRequest } from '@providers/request-context';

import { api, API_PATHS } from '@/utils/api';

const schema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Field is required'),
});

type FormFields = z.infer<typeof schema>;

export function useLoginForm() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'luna.thecat@gmail.com',
      password: 'test1234',
    },
  });
  const router = useRouter();
  const { isPending, start, finish, fail } = useRequest();

  const [generalError, setGeneralError] = useState('');
  const { setAccessToken } = useAuth();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      const isFormValid = await form.trigger();
      if (!isFormValid) return;

      start('Trying to log you in, please wait ...');

      const validatedFields = schema.safeParse(form.getValues());

      if (!validatedFields.success) {
        return fail('Login failed. Please check credentials and try again.');
      }

      const response = await api.post<{ accessToken: string }>(API_PATHS.auth.login, validatedFields.data);
      finish('Login successful! Redirecting…');
      setAccessToken?.(response.accessToken);
      setTimeout(() => router.push('/'), 2000);
    } catch (error) {
      setGeneralError('Unable to login. Please try again later.');
    }
  };

  return {
    form,
    isPending,
    generalError,
    handleSubmit,
  };
}
