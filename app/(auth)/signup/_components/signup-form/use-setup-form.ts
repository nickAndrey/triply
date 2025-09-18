'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z
  .object({
    username: z.string().min(1, 'Field is required'),
    email: z.email('Email is invalid').min(1, 'Field is required'),
    password: z.string().min(1, 'Field is required'),
    confirm_password: z.string().min(1, 'Field is required'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['confirm_password'],
      });
    }
  });

type FormFields = z.infer<typeof schema>;

export function useSetupForm() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  return {
    form,
  };
}
