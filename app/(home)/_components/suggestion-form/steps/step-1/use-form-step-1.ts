'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';

export const schema = z.object({
  destination: z.string().min(1, 'Field is required.'),
});

export type FormFields = z.infer<typeof schema>;

export function useFormStep1() {
  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: {
      destination: '',
    },
  });

  return {
    form,
  };
}
