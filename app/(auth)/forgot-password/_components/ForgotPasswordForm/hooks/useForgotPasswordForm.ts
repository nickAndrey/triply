'use client';

import { FormEventHandler } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRequest } from '@providers/request-context';

import { API_PATHS } from '@/constants/paths';
import { api } from '@/utils/api';

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

      await api.post<{ message: string }>(API_PATHS.auth.forgotPassword, form.getValues());

      finish('Password reset email sent');
    } catch (error) {
      fail('Failed to send reset email. Please try again later.');
    }
  };

  return {
    form,
    isPending,
    handleSubmit,
  };
}
