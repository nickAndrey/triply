'use client';

import { FormEventHandler } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRequest } from '@providers/request-context';

import { API_PATHS } from '@/constants/paths';
import { browserApiClient } from '@/utils/api/api-client-browser';

const schema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Passwords do not match',
    path: ['password_confirm'],
  });

type FormFields = z.infer<typeof schema>;

export function useUpdatePasswordForm() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      password_confirm: '',
    },
  });

  const { start, finish, fail, isPending } = useRequest();

  const router = useRouter();
  const params = useSearchParams();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const isFormValid = await form.trigger();
    if (!isFormValid) return;

    try {
      start('Updating Password...');

      const result = await browserApiClient.post<{ message?: string; error?: string }>(API_PATHS.auth.resetPassword, {
        password: form.getValues('password'),
        passwordResetToken: params.get('token'),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      finish('Password has been updated successfully, redirecting to the login page...');
      setTimeout(() => router.push('/login'), 5000);
    } catch (error) {
      console.error((error as Error).message);
      fail('Failed to update password. Please try again later');
    }
  };

  return {
    form,
    isPending,
    handleSubmit,
  };
}
