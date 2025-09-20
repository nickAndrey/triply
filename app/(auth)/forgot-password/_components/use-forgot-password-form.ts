'use client';

import { sendResetPasswordEmail } from '@/app/_actions/send-reset-password-email';
import { useRequest } from '@/app/_providers/request-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  email: z.email(),
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
      finish({ message: 'Password reset email sent' });
    } else {
      fail(result?.error?.message || 'Failed to send reset email.');
    }
  };

  return {
    form,
    isPending,
    handleSubmit,
  };
}
