'use client';

import { updatePassword } from '@/app/_actions/update-password';
import { useRequest } from '@/app/_providers/request-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { FormEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  password: z.string(),
  password_confirm: z.string(),
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

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const isFormValid = await form.trigger();
    if (!isFormValid) return;

    start('Updating Password...');

    const result = await updatePassword({
      password: form.getValues('password'),
    });

    if (result.success) {
      finish({
        message: 'Password has been updated successfully, you will be redirected to login page in 5 seconds',
      });

      setTimeout(() => router.push('/login'), 5000);
    } else {
      fail(result?.error?.message || 'Failed to update password.');
    }
  };

  return {
    form,
    isPending,
    handleSubmit,
  };
}
