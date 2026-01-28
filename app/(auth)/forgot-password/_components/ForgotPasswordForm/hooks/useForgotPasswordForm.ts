'use client';

import { FormEventHandler } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRequest } from '@providers/request-context';

import { API_PATHS } from '@/constants/paths';
import { browserApiClient } from '@/utils/api/api-client-browser';

const schema = z.object({
  email: z.email('Invalid email.'),
});

type FormFields = z.infer<typeof schema>;

export function useForgotPasswordForm() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
    },
  });

  const { start, finish, fail, isPending } = useRequest();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const isFormValid = await form.trigger();
    if (!isFormValid) return;

    try {
      start('Sending reset password email...');

      const response = await browserApiClient.post<{ message?: string; error?: string }>(
        API_PATHS.auth.requestPasswordReset,
        form.getValues()
      );

      if (response.error) {
        throw new Error(response.error);
      }

      finish('Password reset email sent');
    } catch (error) {
      console.error((error as Error).message);
      fail('Failed to send reset email. Please try again later.');
    }
  };

  return {
    form,
    isPending,
    handleSubmit,
  };
}
