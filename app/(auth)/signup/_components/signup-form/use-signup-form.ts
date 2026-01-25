'use client';

import { FormEventHandler } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useRequest } from '@providers/request-context';

import { API_PATHS } from '@/constants/paths';
import { api } from '@/utils/api';

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

export function useSignupForm() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  });

  const { start, fail, isPending } = useRequest();
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();

      const isValid = await form.trigger();
      if (!isValid) return;

      start('Creating your account, please wait…');

      const validatedFields = schema.safeParse(form.getValues());

      if (!validatedFields.success) {
        return {
          success: false,
          errors: z.treeifyError(validatedFields.error).properties,
        };
      }

      await api.post(API_PATHS.auth.register, {
        name: validatedFields.data.username,
        email: validatedFields.data.email,
        password: validatedFields.data.password,
      });

      router.push('/signup?confirmation_sent=true');
    } catch (error) {
      console.error(error);
    }
  };

  return {
    form,
    isPending,
    handleSubmit,
  };
}
