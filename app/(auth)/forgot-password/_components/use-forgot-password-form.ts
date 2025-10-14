'use client';

import { FormEventHandler } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { sendResetPasswordEmail } from '@server-actions/send-reset-password-email';

import { useRequest } from '@providers/request-context';

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

    start('Sending reset password email...');

    const result = await sendResetPasswordEmail(form.getValues());

    if (result.success) {
      finish('Password reset email sent');
    }

    if (result.errors) {
      fail(result?.errors?.email?.errors[0] || 'Failed to send reset email.');

      if ('email' in result.errors) {
        form.setError('email', {
          type: 'server',
          message: result.errors.email?.errors[0],
        });
      }
    }
  };

  return {
    form,
    isPending,
    handleSubmit,
  };
}
