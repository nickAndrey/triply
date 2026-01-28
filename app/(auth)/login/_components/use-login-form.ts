'use client';

import { FormEventHandler, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRequest } from '@providers/request-context';

import { API_PATHS } from '@/constants/paths';
import { browserApiClient } from '@/utils/api/api-client-browser';

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

    try {
      const isFormValid = await form.trigger();
      if (!isFormValid) return;

      start('Trying to log you in, please wait ...');

      const validatedFields = schema.safeParse(form.getValues());

      if (!validatedFields.success) {
        return fail('Login failed. Please check credentials and try again.');
      }

      await browserApiClient.post(API_PATHS.auth.login, validatedFields.data);
      finish('Login successful! Redirecting…');
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
