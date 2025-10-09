'use client';

import { FormEventHandler } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { signup } from '@server-actions/signup';

import { useRequest } from '@providers/request-context';

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

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const isValid = await form.trigger();
    if (!isValid) return;

    start('Creating your account, please wait…');

    const result = await signup(form.getValues());

    if (result.errors) {
      fail('Sign up failed. Please check the highlighted fields and try again.');

      if ('username' in result.errors) {
        form.setError('username', {
          type: 'server',
          message: result.errors.username?.errors[0],
        });
      }

      if ('email' in result.errors) {
        form.setError('email', {
          type: 'server',
          message: result.errors.email?.errors[0],
        });
      }

      if ('password' in result.errors) {
        form.setError('password', {
          type: 'server',
          message: result.errors.password?.errors[0],
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
